-- ============================================
-- CLEANUP: Eliminar políticas RLS innecesarias
-- Mantener solo el enfoque de postgres ownership
-- ============================================
-- NOTA: Usa IF EXISTS para evitar errores si alguna tabla/política no existe

-- 1. Eliminar todas las políticas RLS existentes
DO $$
DECLARE
    policy_record RECORD;
BEGIN
    FOR policy_record IN
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I',
            policy_record.policyname,
            policy_record.schemaname,
            policy_record.tablename);
        RAISE NOTICE 'Dropped policy: % on table: %', policy_record.policyname, policy_record.tablename;
    END LOOP;
END $$;

-- 2. Deshabilitar RLS en todas las tablas que existan
DO $$
DECLARE
    table_record RECORD;
BEGIN
    FOR table_record IN
        SELECT tablename
        FROM pg_tables
        WHERE schemaname = 'public'
        AND tableowner = 'postgres'
    LOOP
        EXECUTE format('ALTER TABLE %I DISABLE ROW LEVEL SECURITY', table_record.tablename);
        RAISE NOTICE 'RLS disabled for table: %', table_record.tablename;
    END LOOP;
END $$;

-- 3. Verificar configuración final
SELECT
    schemaname,
    tablename,
    tableowner,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 4. Verificar que no quedan políticas
SELECT
    tablename,
    policyname,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
