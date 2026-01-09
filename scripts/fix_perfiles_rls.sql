-- ==============================================================================
-- SCRIPT DE CORRECCIÓN: Error "relation public.perfiles does not exist"
-- ==============================================================================
-- Este script elimina las políticas de seguridad (RLS) antiguas que apuntaban
-- a la tabla inexistente 'perfiles' y crea nuevas políticas apuntando a 'usuarios'.

BEGIN;

-- 1. Limpiar políticas antiguas en la tabla 'clientes'
-- Se usan nombres comunes, pero el DROP IF EXISTS previene errores si no existen.
DROP POLICY IF EXISTS "Enable read access for all users" ON public.clientes;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.clientes;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.clientes;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.clientes;
DROP POLICY IF EXISTS "public_perfiles_policy" ON public.clientes;
DROP POLICY IF EXISTS "Permitir lectura a usuarios registrados" ON public.clientes;
DROP POLICY IF EXISTS "Permitir escritura a usuarios activos" ON public.clientes;

-- 2. Asegurar que RLS esté activado
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- 3. Crear NUEVAS políticas vinculadas a 'public.usuarios'

-- Política de LECTURA:
-- Permite ver la lista de clientes a cualquier usuario autenticado que tenga un registro en 'usuarios'.
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

-- Política de ESCRITURA (Insert, Update, Delete):
-- Permite modificar clientes solo a usuarios que estén marcados como 'activo = true'.
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

-- ==============================================================================
-- INSTRUCCIONES:
-- 1. Copia todo este código.
-- 2. Ve al SQL Editor en tu dashboard de Supabase.
-- 3. Pega y ejecuta el script.
-- 4. Recarga la aplicación web.
-- ==============================================================================
