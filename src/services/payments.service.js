import { supabase } from './supabase';

export const paymentsService = {
    async getAll() {
        const { data, error } = await supabase
            .from('pagos')
            .select('*, clientes(nombre_completo)')
            .order('fecha_pago', { ascending: false });

        if (error) throw error;
        return data || [];
    },

    async create(pagoData) {
        const { data, error } = await supabase
            .from('pagos')
            .insert([pagoData])
            .select();

        if (error) throw error;
        return data;
    },

    async checkConnectionPayment(clienteId) {
        const { data, error } = await supabase
            .from('pagos')
            .select('id')
            .eq('cliente_id', clienteId)
            .eq('tipo', 'conexion')
            .limit(1);

        if (error) throw error;
        return data.length > 0;
    }
};
