# Product Requirements Document (PRD) - Aguatera App

## 1. Visión General
**Aguatera App** es una plataforma de gestión integral para administradoras de servicios de agua (Aguateras). El objetivo es digitalizar el ciclo completo desde el registro de abonados y la generación de facturación/deuda hasta la gestión de cobros y el control de estado de servicio (cortes y reconexiones).

## 2. Objetivos Estratégicos
- Automatizar la generación de deudas mensuales por abonado.
- Facilitar la gestión de cobros en calle y oficina con múltiples métodos de pago.
- Centralizar la información de contacto y ubicación GPS de los clientes.
- Proveer un historial auditable de incidencias y cortes de servicio.

## 3. Roles de Usuario (app_rol)
- **Administrador**: Acceso total, gestión de tarifas, reportes financieros y auditoría de usuarios.
- **Cobrador/Staff**: Registro de pagos, consulta de deudas de clientes y actualización de estados de servicio en campo.

## 4. Requisitos Funcionales

### Módulo de Clientes
- Registro de abonados con datos personales y coordenadas GPS.
- Clasificación por estados (`app_estado_cliente`): `activo`, `cortado`, `baja`, `inactivo`.
- Buscador rápido por nombre o cédula.

### Módulo de Deudas y Facturación
- Generación masiva de deudas por periodos (mes/año).
- Vinculación de deudas a tarifas específicas (categorías de servicio).
- Seguimiento de estados de deuda (`app_estado_deuda`): `pendiente`, `pagado`, `anulado`.

### Módulo de Pagos
- Registro de transacciones vinculadas a deudas específicas (`deuda_id`).
- Tipos de pago (`app_tipo_pago`): `mensualidad`, `conexion`, `reparacion`, `multa`, `otro`.
- Métodos de pago (`app_metodo_pago`): `efectivo`, `transferencia`, `qr`, `cheque`.
- Registro del responsable del cobro (`cobrado_por` -> `usuarios.id`).

### Módulo de Servicio Técnico
- Historial de cortes y reconexiones (`historial_cortes`).
- Registro de motivos y observaciones técnicas por cliente.
- Trazabilidad del personal que realiza la acción (`realizado_por`).

### Módulo de Tarifas
- Gestión de catálogo de precios (`tarifas`).
- Control de tarifas activas/inactivas.

## 5. Requisitos No Funcionales (Stack Técnico)
- **Frontend**: React 19 (Vite) para una interfaz reactiva y moderna.
- **Estilos**: TailwindCSS 4 para un diseño rápido y consistente.
- **Backend**: Supabase (PostgreSQL) para manejo de datos, Auth y RLS.
- **Arquitectura**: Separación estricta de lógica en `src/services/`.

## 6. Modelo de Datos Detallado
### Tablas Principales
- **`clientes`**: `id`, `nombre_completo`, `cedula`, `telefono`, `direccion`, `coordenadas_gps`, `estado`.
- **`deudas`**: `id`, `cliente_id` (FK), `monto`, `periodo` (date), `estado`.
- **`pagos`**: `id`, `cliente_id` (FK), `deuda_id` (FK), `cobrado_por` (FK), `monto`, `tipo`, `metodo`, `referencia`, `fecha_pago`.
- **`tarifas`**: `id`, `nombre`, `monto`, `activo`.
- **`historial_cortes`**: `id`, `cliente_id` (FK), `realizado_por` (FK), `fecha_corte`, `motivo`, `fecha_reconexion`, `observacion`.
- **`usuarios`**: `id` (uuid), `auth_user_id` (FK), `nombre_completo`, `rol`, `activo`.

### Flujo Crítico
1. **Cliente** es creado.
2. **Deuda** se genera mensualmente (o por servicio).
3. **Pago** se registra vinculándose a una **Deuda** específica, cambiando su estado a `pagado`.
4. El **Cobrador** registra el pago y queda auditado en la tabla.
