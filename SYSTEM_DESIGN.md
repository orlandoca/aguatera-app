# System Design - Aguatera App

## 1. Arquitectura General
Aguatera App sigue una arquitectura **Client-Server** tradicional con un fuerte enfoque en **Backend-as-a-Service (BaaS)** mediante Supabase.

### 1.1. Componentes Principales
*   **Frontend (SPA):** Desarrollado en React 19 (Vite) y alojado en Vercel. Responsable de la presentación, la gestión del estado local y la interacción del usuario.
*   **Backend / Database:** Supabase (PostgreSQL). Actúa como la única fuente de verdad, gestionando la persistencia, la autenticación (Auth), y la autorización (Row Level Security).
*   **Capa de Servicios (Frontend):** Actúa como un SDK interno (`src/services/`). Abstrae toda la comunicación con Supabase, aislando a los componentes de UI de la lógica de acceso a datos.

## 2. Estrategia de Datos y Transaccionalidad

Dado que el sistema maneja transacciones financieras (pagos de servicios), la integridad de los datos es crítica.

### 2.1. El Ciclo de Vida del Pago
El proceso de registrar un pago involucra múltiples entidades y debe ser atómico (o emulado de forma segura en el cliente si no se usan RPCs).

1.  **Validación:** El frontend verifica que la deuda esté `pendiente`.
2.  **Inserción del Pago:** Se crea un registro en la tabla `pagos` vinculado a `deuda_id`, registrando el monto, método y el `usuario_id` (cobrador).
3.  **Actualización de la Deuda:** Simultáneamente, el estado de la deuda vinculada cambia a `pagado` (o `parcial` si se decide implementar a futuro).

*Decisión Arquitectónica:* Para evitar inconsistencias (ej. se registra el pago pero falla la actualización de la deuda), estas operaciones deberían idealmente ejecutarse mediante un **Stored Procedure (RPC)** en PostgreSQL, garantizando atomicidad (ACID).

### 2.2. Generación Masiva de Deudas
Mensualmente, el sistema debe generar deudas para todos los clientes `activos`.
*Decisión Arquitectónica:* Debido a que iterar sobre cientos o miles de clientes desde el frontend (React) es ineficiente y propenso a fallos de red, este proceso DEBE delegarse a:
1.  Un **Edge Function** de Supabase (invocado manualmente por el Admin).
2.  Un **pg_cron** (Cron Job) en PostgreSQL para que se ejecute automáticamente el día 1 de cada mes.

## 3. Seguridad y Autorización (Row Level Security - RLS)

La seguridad no se confía al frontend. Supabase RLS garantiza que incluso si alguien realiza peticiones directamente a la API de Supabase, solo accederá a lo permitido por su rol (`app_rol`).

### 3.1. Políticas por Rol
*   **Administrador (`admin`):**
    *   `ALL` en todas las tablas (`clientes`, `deudas`, `pagos`, `tarifas`, `historial_cortes`, `usuarios`).
*   **Cobrador (`cobrador` / `staff`):**
    *   `SELECT` en `clientes` (solo lectura para buscar deudores).
    *   `SELECT` en `deudas` (para ver qué cobrar).
    *   `INSERT`, `SELECT` en `pagos` (pueden registrar pagos y ver los suyos, pero **no** modificar pagos pasados - inmutabilidad).
    *   `INSERT`, `SELECT` en `historial_cortes` (pueden registrar un corte en campo).

### 3.2. Implementación de Roles
El rol del usuario se almacena en la tabla pública `usuarios`, la cual está vinculada 1:1 con la tabla segura `auth.users` de Supabase. Las políticas RLS hacen un `JOIN` implícito (o usan claims en el JWT) para verificar el rol antes de permitir una operación.

## 4. Flujo de Datos (Data Flow) en el Frontend

Para mantener el rendimiento y la legibilidad en React 19:

1.  **Lectura (Queries):** Los componentes solicitan datos a través de hooks o llamadas directas a `src/services/`. Se delega el filtrado y paginación a la base de datos (PostgREST) en lugar de hacerlo en memoria en el cliente.
2.  **Mutaciones (Writes):** Las acciones del usuario (ej. "Registrar Pago") llaman a un método en `services`. Si la operación es exitosa, se actualiza el estado local (optimistic UI) o se re-ejecuta la query para refrescar la vista.
3.  **Estado Global:** Limitado exclusivamente a datos de sesión (Usuario actual, Rol, Preferencias de UI) mediante Context API (`AuthContext`). Los datos del dominio (clientes, pagos) no deben duplicarse en un store global masivo.

## 5. Consideraciones de Escalabilidad (Futuro)

*   **Modo Offline:** Si los cobradores operan en zonas rurales sin conexión, se requerirá implementar Service Workers y almacenamiento local (IndexedDB/PWA). Los pagos se encolarían localmente y se sincronizarían al recuperar la conexión.
*   **Auditoría Estricta:** Implementar *Triggers* en PostgreSQL para crear un log inmutable de cualquier actualización o borrado (UPDATE/DELETE) en las tablas `pagos` o `deudas`, protegiendo al sistema contra fraudes internos.
