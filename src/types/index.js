/**
 * @typedef {Object} Cliente
 * @property {number} id
 * @property {string} nombre_completo
 * @property {string} cedula
 * @property {string} telefono
 * @property {string} direccion
 * @property {string} [coordenadas_gps]
 * @property {string} estado
 * @property {'activo' | 'cortado' | 'suspendido'} estado_servicio
 * @property {number} [deuda]
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Pago
 * @property {number} id
 * @property {number} cliente_id
 * @property {string} cobrado_por
 * @property {number} [deuda_id]
 * @property {number} monto
 * @property {'efectivo' | 'transferencia' | 'qr'} metodo
 * @property {string} [referencia]
 * @property {string} fecha_pago
 * @property {string} [periodo_cubierto]
 */

/**
 * @typedef {Object} UserProfile
 * @property {string} id
 * @property {string} nombre_completo
 * @property {'admin' | 'staff' | 'cobrador'} rol
 * @property {boolean} activo
 */

export { };
