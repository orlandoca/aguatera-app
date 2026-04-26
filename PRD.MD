# Product Requirements Document (PRD) - Aguatera App

## 1. Visión General
**Aguatera App** es una plataforma de gestión integral para administradoras de servicios de agua (Aguateras). El objetivo es digitalizar el ciclo completo desde el registro de abonados y la generación de facturación/deuda hasta la gestión de cobros y el control de estado de servicio (cortes y reconexiones).

## 2. Objetivos Estratégicos
- Automatizar la generación de deudas mensuales por abonado.
- Facilitar la gestión de cobros en calle y oficina con múltiples métodos de pago.
- Centralizar la información de contacto y ubicación GPS de los clientes.
- Proveer un historial auditable de incidencias y cortes de servicio.

## 3. Roles de Usuario
- **Administrador**: Acceso total, gestión de tarifas, reportes financieros y auditoría de usuarios.
- **Cobrador/Staff**: Registro de pagos, consulta de deudas de clientes y actualización de estados de servicio en campo.

## 4. Requisitos Funcionales

### Módulo de Clientes
- Registro de abonados con datos personales y coordenadas GPS.
- Clasificación por estados: Activo, Cortado, Baja, Inactivo.
- Buscador rápido por nombre o cédula.

### Módulo de Deudas y Facturación
- Generación masiva de deudas por periodos (mes/año).
- Vinculación de deudas a tarifas específicas (categorías de servicio).
- Seguimiento de estados de deuda: Pendiente, Pagado, Anulado.

### Módulo de Pagos
- Registro de transacciones vinculadas a deudas específicas.
- Soporte para métodos: Efectivo, Transferencia, QR, Cheque.
- Registro del responsable del cobro (staff).

### Módulo de Servicio Técnico
- Historial de cortes y reconexiones con motivos y responsables.
- Registro de observaciones técnicas por cliente.

## 5. Requisitos No Funcionales (Stack Técnico)
- **Frontend**: React 19 (Vite) para una interfaz reactiva y moderna.
- **Estilos**: TailwindCSS 4 para un diseño rápido, consistente y sin archivos CSS pesados.
- **Backend**: Supabase (PostgreSQL) para manejo de datos en tiempo real, autenticación y seguridad por fila (RLS).
- **Arquitectura**: Separación estricta de lógica de datos en una capa de servicios (`src/services/`).

## 6. Modelo de Datos (Resumen)
- **Tablas**: `clientes`, `pagos`, `deudas`, `tarifas`, `historial_cortes`, `usuarios`.
- **Flujo**: Cliente -> tiene Deudas -> se saldan con Pagos.
