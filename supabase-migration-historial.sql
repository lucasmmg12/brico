-- ============================================
-- MIGRACIÓN: Agregar columna de historial
-- ============================================

-- Agregar columna para almacenar el historial completo de la conversación
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS historial_conversacion TEXT;

-- Agregar columna para almacenar el análisis generado por OpenAI
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS analisis_historial JSONB;

-- Agregar índice para búsquedas en el análisis
CREATE INDEX IF NOT EXISTS idx_pedidos_analisis ON pedidos USING gin(analisis_historial);

-- Comentarios para documentación
COMMENT ON COLUMN pedidos.historial_conversacion IS 'Historial completo de la conversación de WhatsApp en formato texto';
COMMENT ON COLUMN pedidos.analisis_historial IS 'Análisis generado por OpenAI: resumen, promociones solicitadas, intenciones, etc.';
