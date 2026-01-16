-- ==============================================================================
-- SCRIPT "NUCLEAR": RESET COMPLETO DE POLITICAS EN CLIENTES
-- ==============================================================================
-- Este script NO adivina los nombres de las politicas.
-- Busca ACTIVAMENTE todas las politicas en la tabla 'clientes' y las borra una por una.
-- Luego crea las politicas correctas.

BEGIN;

DO $$
DECLARE
    pol record;
BEGIN
    -- Recorre todas las politicas existentes para la tabla 'clientes' en el esquema 'public'
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'clientes' AND schemaname = 'public'
    LOOP
        -- Ejecuta un DROP dinámico para cada politica encontrada
        RAISE NOTICE 'Borrando politica: %', pol.policyname;
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.clientes', pol.policyname);
    END LOOP;
END $$;

-- Asegurar que RLS esta activado
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- Crear las Politicas Correctas (Vinculadas a 'usuarios')
-- ---------------------------------------------------------

-- 1. Lectura: Ver clientes si tienes usuario registrado
CREATE POLICY "Permitir lectura a usuarios registrados"
ON public.clientes
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE usuarios.auth_user_id = auth.uid()
  )
);

-- 2. Escritura: Modificar si eres usuario activo
CREATE POLICY "Permitir escritura a usuarios activos"
ON public.clientes
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE usuarios.auth_user_id = auth.uid()
    AND usuarios.activo = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.usuarios
    WHERE usuarios.auth_user_id = auth.uid()
    AND usuarios.activo = true
  )
);

COMMIT;
