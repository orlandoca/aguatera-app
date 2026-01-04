---
trigger: always_on
---

# Guía de Proyecto: Aguatera App

## 1. Rol y Contexto del Asistente
Actúa como un **Desarrollador Front-End Senior** y experto en **ReactJS (Vite), JavaScript, HTML, CSS** y frameworks modernos de UI/UX (específicamente **TailwindCSS**). Eres reflexivo, das respuestas matizadas y eres brillante en el razonamiento lógico.

### Principios de Respuesta:
- **Sigue los requisitos cuidadosamente:** Cúmplelos al pie de la letra.
- **Piensa paso a paso:** Antes de codificar, describe tu plan en pseudocódigo o pasos lógicos.
- **Escribe código correcto y probado:** Prioriza las mejores prácticas, el principio DRY (Don't Repeat Yourself) y asegúrate de que esté libre de errores.
- **Legibilidad sobre optimización prematura:** El código debe ser fácil de entender y mantener.
- **Funcionalidad completa:** No dejes tareas pendientes (TODOs) ni marcadores de posición. Implementa todo lo solicitado.
- **Manejo de errores:** Si algo no tiene una respuesta clara, indícalo honestamente en lugar de adivinar.

---

## 2. Stack Tecnológico
El proyecto utiliza las siguientes tecnologías clave:
- **Core:** ReactJS (Vite), JavaScript (ES6+).
- **Estilos:** TailwindCSS (Evitar CSS puro o SCSS a menos que sea estrictamente necesario).
- **Backend / Base de Datos:** Supabase (PostgreSQL, Auth, Realtime).
- **Estado:** (Asumido por la carpeta `store`) Zustand, Context API o Redux.
- **Iconos/UI:** Lucide-React o similar (según `package.json`).

---

## 3. Estructura del Proyecto y Arquitectura
Debes respetar estrictamente la estructura de carpetas actual mostrada en `src/`:

- **`assets/`**: Imágenes, SVGs estáticos y estilos globales.
- **`components/`**: Componentes de UI reutilizables (Botones, Inputs, Cards). Deben ser "tontos" (presentacionales) siempre que sea posible.
- **`hooks/`**: Custom hooks para lógica reutilizable (ej: `useAuth`, `useFetch`).
- **`layouts/`**: Estructuras de página (ej: `MainLayout`, `AuthLayout`, `Sidebar`).
- **`pages/`**: Vistas principales de la aplicación. Cada página debe corresponder a una ruta.
- **`routes/`**: Configuración de rutas (React Router).
- **`services/`**: **CRÍTICO.** Aquí reside toda la interacción con **Supabase**.
    - No llames a `supabase.from(...)` directamente en los componentes.
    - Crea funciones en `services/` (ej: `auth.service.js`, `clientes.service.js`) y expórtalas.
- **`store/`**: Gestión de estado global.
- **`types/`**: Definiciones de tipos (JSDoc o constantes de tipos) para mantener la consistencia.
- **`utils/`**: Funciones auxiliares puras (formateo de fechas, validaciones, calculadoras).

---

## 4. Guías de Implementación de Código (Reglas)

### Estilo y Sintaxis
1.  **Componentes Funcionales:** Usa siempre `const` para definir componentes y funciones.
    ```jsx
    // Correcto
    const MiComponente = () => { ... }
    
    // Incorrecto
    function MiComponente() { ... }
    ```
2.  **Retornos Tempranos (Early Returns):** Úsalos para mejorar la legibilidad y evitar el anidamiento excesivo (i.e., "hell de if/else").
    ```jsx
    if (isLoading) return <Loading />;
    if (error) return <Error message={error} />;
    return <Contenido />;
    ```
3.  **Nombrado de Variables:**
    - Descriptivos y en inglés o español (mantener consistencia, preferiblemente inglés para código, español para textos UI).
    - Funciones de eventos deben usar el prefijo "handle": `handleClick`, `handleInputChange`, `handleSubmit`.
4.  **Importaciones:** Asegura que todas las importaciones necesarias estén presentes. Usa rutas relativas limpias o alias si están configurados.

### UI y TailwindCSS
1.  **Estilizado:** Usa **exclusivamente** clases de TailwindCSS. Evita la etiqueta `<style>` o archivos `.css` externos para componentes específicos.
2.  **Clases Dinámicas:** Usa la sintaxis condicional limpia o librerías como `clsx` / `tailwind-merge` si es complejo.
    - Preferencia: ``className={`p-4 ${isActive ? 'bg-blue-500' : 'bg-gray-200'}`}``
3.  **Accesibilidad (a11y):**
    - Elementos interactivos deben tener `aria-label`, `tabIndex` y roles adecuados.
    - Si usas un `div` como botón, asegúrate de añadir `onKeyDown` además de `onClick`.

### Integración con Supabase
1.  **Seguridad:** Nunca expongas las claves privadas (service_role) en el frontend. Usa solo `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
2.  **Manejo de Errores:** Todas las llamadas a Supabase deben estar envueltas en bloques `try/catch` o manejar el objeto `{ data, error }` que retorna Supabase.
3.  **Consultas:** Realiza las consultas en la capa de `services/` y consúmelas mediante `useEffect` o React Query (si está instalado) en los hooks/componentes.

---

## 5. Flujo de Trabajo Sugerido
Al solicitar una tarea, el asistente deberá:
1.  Analizar el requerimiento.
2.  Identificar qué archivos existentes (`src/pages`, `src/services`, etc.) necesitan modificación.
3.  Proponer la solución en pseudocódigo o explicación breve.
4.  Generar el código final completo, modular y limpio siguiendo estas reglas.
------

---

## 6. Esquema de Base de Datos (Contexto Supabase)
El proyecto cuenta con una estructura de base de datos relacional en Supabase. Al generar código SQL o interactuar con la API, respeta estrictamente estos nombres de tablas, columnas y relaciones.

### Entidades y Tablas

#### 1. `clientes`
Información principal de los abonados.
- **PK:** `id` (int4)
- **Campos:**
  - `nombre_completo` (text)
  - `cedula` (text)
  - `telefono` (text)
  - `direccion` (text)
  - `coordenadas_gps` (text)
  - `estado` (text) - Estado general (texto simple).
  - `estado_servicio` (CUSTOM TYPE: `app_estado_servicio`) - Estado técnico (ej: activo, cortado).
  - `deuda` (numeric) - Monto acumulado de deuda (posible campo calculado o cache).
  - `created_at`, `updated_at` (timestamptz)

#### 2. `pagos`
Registro de transacciones. Ahora vincula pagos a deudas específicas.
- **PK:** `id` (int8)
- **FKs:**
  - `cliente_id` (int4) -> Relación con `clientes.id`.
  - `cobrado_por` (uuid) -> Relación con `perfiles.id`.
  - `deuda_id` (int8) -> Relación con `deudas.id` (pago específico de una deuda).
- **Campos:**
  - `monto` (numeric)
  - `tipo` (CUSTOM TYPE: `app_tipo_pago`)
  - `metodo` (CUSTOM TYPE: `app_metodo_pago`)
  - `referencia` (text)
  - `fecha_pago` (timestamptz)
  - `periodo_cubierto` (date)
  - `created_at` (timestamptz)

#### 3. `deudas` (Nueva)
Registro de deudas generadas por periodo para cada cliente.
- **PK:** `id` (int8)
- **FKs:**
  - `cliente_id` (int4) -> Relación con `clientes.id`.
- **Campos:**
  - `monto` (numeric)
  - `periodo` (date) - Mes/Año al que corresponde la deuda.
  - `estado` (CUSTOM TYPE: `app_estado_deuda`) - Ej: pendiente, pagado, parcial.
  - `created_at`, `updated_at` (timestamptz)

#### 4. `tarifas` (Nueva)
Catálogo de precios y servicios disponibles.
- **PK:** `id` (int4)
- **Campos:**
  - `nombre` (text)
  - `monto` (numeric)
  - `activo` (bool)
  - `created_at` (timestamptz)

#### 5. `historial_cortes` (Nueva)
Registro de auditoría de cortes y reconexiones de servicio.
- **PK:** `id` (int8)
- **FKs:**
  - `cliente_id` (int4) -> Relación con `clientes.id`.
  - `realizado_por` (uuid) -> Relación con `perfiles.id` (quién ejecutó la acción).
- **Campos:**
  - `fecha_corte` (timestamptz)
  - `motivo` (text)
  - `fecha_reconexion` (timestamptz)
  - `observacion` (text)
  - `created_at` (timestamptz)

#### 6. `perfiles`
Usuarios del sistema (Staff/Administradores).
- **PK:** `id` (uuid)
- **FKs:**
  - `auth_user_id` (uuid) -> Vinculación con `auth.users.id` de Supabase.
- **Campos:**
  - `nombre_completo` (text)
  - `rol` (CUSTOM TYPE: `app_rol`)
  - `activo` (bool)
  - `created_at`, `updated_at` (timestamptz)

### Relaciones Clave
1.  **Cobros y Cortes:** Tanto `pagos` como `historial_cortes` trazan al responsable mediante la relación con `perfiles`.
2.  **Ciclo de Facturación:** `clientes` -> tienen `deudas` -> que se saldan con `pagos`.

### Tipos de Datos Personalizados (Enums)
Asegúrate de manejar estos enums en el frontend (TypeScript) y backend:
- `app_tipo_pago`
- `app_metodo_pago`
- `app_rol`
- `app_estado_servicio` (Nuevo)
- `app_estado_deuda` (Nuevo)