import React from 'react';
import { ShieldCheck, AlertCircle, AlertTriangle } from 'lucide-react';

/**
 * Enum de estados de servicio (coincide con DB)
 */
export const SERVICE_STATUS = {
    ACTIVO: 'activo',
    INACTIVO: 'inactivo',
    CORTADO: 'cortado'
};

/**
 * Filtros disponibles para la UI
 */
export const CLIENT_FILTERS = {
    ALL: 'all',
    ACTIVE: 'activo', // Solo activos y sin deuda
    DEBT: 'deuda',    // Con deuda (independiente del estado, aunque usualmente activos/cortados)
    INACTIVE: 'inactivo', // Inactivos o Cortados
};

/**
 * Obtiene la configuración visual (color, icono, label) para un cliente
 * @param {Object} client 
 * @returns {Object} { color, icon, label, dot }
 */
export const getClientStatusConfig = (client) => {
    const hasDebt = client.deuda && Number(client.deuda) > 0;
    const status = client.estado_servicio;

    // Prioridad 1: Cortado
    if (status === SERVICE_STATUS.CORTADO) {
        return {
            status: 'cortado',
            color: 'text-red-700 bg-red-100',
            dot: 'bg-red-500',
            icon: <AlertCircle size={14} />,
            label: 'CORTADO',
            borderColor: 'border-red-200'
        };
    }

    // Prioridad 2: Inactivo
    if (status === SERVICE_STATUS.INACTIVO) {
        return {
            status: 'inactivo',
            color: 'text-slate-600 bg-slate-100',
            dot: 'bg-slate-400',
            icon: <AlertCircle size={14} />, // Icono neutro
            label: 'INACTIVO',
            borderColor: 'border-slate-200'
        };
    }

    // Prioridad 3: Deuda (aunque esté activo)
    if (hasDebt) {
        return {
            status: 'deuda',
            color: 'text-amber-700 bg-amber-100',
            dot: 'bg-amber-500',
            icon: <AlertTriangle size={14} />,
            label: 'DEUDA PENDIENTE',
            borderColor: 'border-amber-200'
        };
    }

    // Default: Activo y al día
    return {
        status: 'activo',
        color: 'text-green-700 bg-green-100',
        dot: 'bg-green-500',
        icon: <ShieldCheck size={14} />,
        label: 'AL DÍA',
        borderColor: 'border-green-200'
    };
};

/**
 * Filtra la lista de clientes según el filtro seleccionado
 */
export const filterClientsByStatus = (clients, filterMode) => {
    if (filterMode === CLIENT_FILTERS.ALL) return clients;

    return clients.filter(c => {
        const hasDebt = c.deuda && Number(c.deuda) > 0;

        if (filterMode === CLIENT_FILTERS.ACTIVE) {
            // Activos sin deuda
            return c.estado_servicio === SERVICE_STATUS.ACTIVO && !hasDebt;
        }

        if (filterMode === CLIENT_FILTERS.DEBT) {
            // Cualquier estado pero con Deuda > 0
            return hasDebt;
        }

        if (filterMode === CLIENT_FILTERS.INACTIVE) {
            // Inactivos o Cortados
            return c.estado_servicio === SERVICE_STATUS.INACTIVO || c.estado_servicio === SERVICE_STATUS.CORTADO;
        }

        return true;
    });
};
