-- ============================================
-- ACTUALIZACIONES DE BASE DE DATOS - BRICO
-- ============================================

-- 1. Actualizar configuración de turnos para permitir 2 pedidos por horario
UPDATE turnos_config 
SET max_pedidos_por_turno = 2 
WHERE unidad_negocio IN ('Mayorista', 'Express');

-- 2. Agregar índice para búsquedas por teléfono (optimización de performance)
CREATE INDEX IF NOT EXISTS idx_pedidos_telefono ON pedidos(cliente_telefono);

-- 3. Agregar columnas para información de sucursal
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS sucursal_direccion TEXT,
ADD COLUMN IF NOT EXISTS sucursal_maps_url TEXT;

-- Verificar cambios
SELECT unidad_negocio, max_pedidos_por_turno 
FROM turnos_config;

-- Verificar índices
SELECT indexname, tablename 
FROM pg_indexes 
WHERE tablename = 'pedidos' AND indexname = 'idx_pedidos_telefono';

-- Verificar nuevas columnas
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'pedidos' 
AND column_name IN ('sucursal_direccion', 'sucursal_maps_url');
