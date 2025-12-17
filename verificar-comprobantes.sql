-- ============================================
-- VERIFICAR COMPROBANTES EN PEDIDOS
-- ============================================

-- Ver todos los pedidos con sus comprobantes
SELECT 
    id,
    created_at,
    cliente_nombre,
    cliente_telefono,
    promo_seleccionada,
    monto,
    comprobante_url,
    CASE 
        WHEN comprobante_url IS NOT NULL THEN '✅ Tiene comprobante'
        ELSE '❌ Sin comprobante'
    END as estado_comprobante
FROM pedidos
ORDER BY created_at DESC
LIMIT 20;

-- Contar pedidos con y sin comprobante
SELECT 
    COUNT(*) as total_pedidos,
    COUNT(comprobante_url) as con_comprobante,
    COUNT(*) - COUNT(comprobante_url) as sin_comprobante
FROM pedidos;

-- Ver solo pedidos CON comprobante
SELECT 
    id,
    cliente_nombre,
    comprobante_url,
    created_at
FROM pedidos
WHERE comprobante_url IS NOT NULL
ORDER BY created_at DESC;
