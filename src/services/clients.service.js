import { supabase } from './supabase';

export const clientsService = {
    async getAll() {
        const { data, error } = await supabase
            .from('clientes')
            .select(`
                *,
                deudas (
                    monto,
                    estado
                )
            `)
            .order('nombre_completo', { ascending: true });

        if (error) throw error;

        // Transform data to include calculated debt
        return data?.map(client => {
            // Calculate total pending debt
            const totalDeuda = client.deudas
                ?.filter(d => d.estado === 'pendiente')
                .reduce((sum, d) => sum + Number(d.monto), 0) || 0;

            return {
                ...client,
                deuda: totalDeuda
            };
        }) || [];
    },

    async create(clienteData) {
        const { data, error } = await supabase
            .from('clientes')
            .insert([clienteData])
            .select();

        if (error) throw error;
        return data;
    },

    async update(id, clienteData) {
        const { data, error } = await supabase
            .from('clientes')
            .update(clienteData)
            .eq('id', id)
            .select();

        if (error) throw error;
        return data;
    },

    async delete(id) {
        const { error } = await supabase
            .from('clientes')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
