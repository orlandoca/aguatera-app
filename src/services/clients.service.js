import { supabase } from './supabase';

export const clientsService = {
    async getAll() {
        const { data, error } = await supabase
            .from('clientes')
            .select('*')
            .order('nombre_completo', { ascending: true });

        if (error) throw error;
        return data || [];
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
