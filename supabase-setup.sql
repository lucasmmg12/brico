-- ============================================
-- GRUPO BRICO - Dashboard Administrativo
-- Script de Configuración de Base de Datos
-- ============================================

-- 1. Crear la tabla de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at timestamptz DEFAULT now(),
    cliente_nombre text NOT NULL,
    cliente_dni text NOT NULL,
    cliente_telefono text,
    unidad_negocio text NOT NULL CHECK (unidad_negocio IN ('Mayorista', 'Express')),
    promo_seleccionada text NOT NULL,
    monto numeric(10, 2) NOT NULL,
    comprobante_url text,
    estado_pago text DEFAULT 'pendiente' CHECK (estado_pago IN ('pendiente', 'pagado', 'rechazado')),
    estado_pedido text DEFAULT 'nuevo' CHECK (estado_pedido IN ('nuevo', 'armado', 'entregado', 'no_vino')),
    fecha_entrega date,
    notas_internas text
);

-- 2. Crear índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_pedidos_unidad_negocio ON pedidos(unidad_negocio);
CREATE INDEX IF NOT EXISTS idx_pedidos_created_at ON pedidos(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado_pago ON pedidos(estado_pago);
CREATE INDEX IF NOT EXISTS idx_pedidos_estado_pedido ON pedidos(estado_pedido);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;

-- 4. Crear políticas de acceso (Para desarrollo - acceso público)
-- IMPORTANTE: En producción, deberías implementar autenticación y políticas más restrictivas

-- Política de lectura pública (para desarrollo)
CREATE POLICY "Permitir lectura pública de pedidos"
ON pedidos FOR SELECT
USING (true);

-- Política de inserción pública (para desarrollo)
CREATE POLICY "Permitir inserción pública de pedidos"
ON pedidos FOR INSERT
WITH CHECK (true);

-- Política de actualización pública (para desarrollo)
CREATE POLICY "Permitir actualización pública de pedidos"
ON pedidos FOR UPDATE
USING (true);

-- Política de eliminación pública (para desarrollo)
CREATE POLICY "Permitir eliminación pública de pedidos"
ON pedidos FOR DELETE
USING (true);

-- 5. Crear bucket de Storage para comprobantes (ejecutar en la consola de Supabase Storage)
-- Nota: Esto debe hacerse manualmente en la UI de Supabase Storage o mediante código
-- Nombre del bucket: 'comprobantes'
-- Configuración: Público para lectura

-- 6. Insertar datos de prueba
INSERT INTO pedidos (cliente_nombre, cliente_dni, unidad_negocio, promo_seleccionada, monto, estado_pago, estado_pedido, fecha_entrega)
VALUES 
    ('Juan Pérez', '12345678', 'Mayorista', 'Promo 1 - Almacén', 15000.00, 'pendiente', 'nuevo', CURRENT_DATE),
    ('María González', '87654321', 'Express', 'Promo 2 - Bebidas', 8500.50, 'pagado', 'armado', CURRENT_DATE),
    ('Carlos Rodríguez', '11223344', 'Mayorista', 'Promo 4 - Carnes', 25000.00, 'pendiente', 'nuevo', CURRENT_DATE + 1),
    ('Ana Martínez', '44332211', 'Express', 'Promo 3 - Limpieza', 6200.00, 'pagado', 'nuevo', CURRENT_DATE),
    ('Luis Fernández', '55667788', 'Mayorista', 'Promo 5 - Verduras', 12000.00, 'rechazado', 'no_vino', CURRENT_DATE - 1);

-- 7. Crear función para obtener estadísticas
CREATE OR REPLACE FUNCTION get_pedidos_stats(unidad text DEFAULT NULL)
RETURNS TABLE (
    total_pedidos bigint,
    total_monto numeric,
    pedidos_pendientes bigint,
    pedidos_pagados bigint,
    pedidos_armados bigint
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::bigint as total_pedidos,
        COALESCE(SUM(monto), 0) as total_monto,
        COUNT(*) FILTER (WHERE estado_pago = 'pendiente')::bigint as pedidos_pendientes,
        COUNT(*) FILTER (WHERE estado_pago = 'pagado')::bigint as pedidos_pagados,
        COUNT(*) FILTER (WHERE estado_pedido = 'armado')::bigint as pedidos_armados
    FROM pedidos
    WHERE unidad IS NULL OR unidad_negocio = unidad;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- INSTRUCCIONES DE USO:
-- ============================================
-- 1. Copia este script completo
-- 2. Ve a tu proyecto de Supabase > SQL Editor
-- 3. Pega el script y ejecuta "Run"
-- 4. Ve a Storage y crea un bucket llamado "comprobantes" con acceso público
-- 5. Copia las credenciales de tu proyecto (URL y anon key) para el frontend
-- ============================================
