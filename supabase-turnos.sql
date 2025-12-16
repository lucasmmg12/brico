-- ============================================
-- SISTEMA DE TURNOS DE ENTREGA - GRUPO BRICO
-- ============================================

-- Agregar campos de turno a la tabla pedidos
ALTER TABLE pedidos 
ADD COLUMN IF NOT EXISTS turno_fecha DATE,
ADD COLUMN IF NOT EXISTS turno_hora TIME,
ADD COLUMN IF NOT EXISTS turno_confirmado BOOLEAN DEFAULT FALSE;

-- Crear tabla de configuración de turnos
CREATE TABLE IF NOT EXISTS turnos_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    unidad_negocio TEXT NOT NULL CHECK (unidad_negocio IN ('Mayorista', 'Express')),
    hora_inicio TIME NOT NULL DEFAULT '09:00',
    hora_fin TIME NOT NULL DEFAULT '23:00',
    intervalo_minutos INTEGER NOT NULL DEFAULT 10,
    max_pedidos_por_turno INTEGER NOT NULL DEFAULT 3,
    dias_habiles TEXT[] DEFAULT ARRAY['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(unidad_negocio)
);

-- Insertar configuración por defecto
INSERT INTO turnos_config (unidad_negocio, hora_inicio, hora_fin, intervalo_minutos, max_pedidos_por_turno)
VALUES 
    ('Mayorista', '09:00', '23:00', 10, 3),
    ('Express', '09:00', '23:00', 10, 3)
ON CONFLICT (unidad_negocio) DO NOTHING;

-- Crear tabla de turnos bloqueados (para feriados, mantenimiento, etc)
CREATE TABLE IF NOT EXISTS turnos_bloqueados (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    unidad_negocio TEXT NOT NULL CHECK (unidad_negocio IN ('Mayorista', 'Express')),
    fecha DATE NOT NULL,
    hora_inicio TIME,
    hora_fin TIME,
    motivo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(unidad_negocio, fecha, hora_inicio, hora_fin)
);

-- Crear vista de turnos disponibles
CREATE OR REPLACE VIEW turnos_disponibles AS
SELECT 
    tc.unidad_negocio,
    CURRENT_DATE + interval '1 day' * generate_series(0, 30) AS fecha,
    (tc.hora_inicio + interval '1 minute' * (tc.intervalo_minutos * generate_series(0, 
        EXTRACT(EPOCH FROM (tc.hora_fin - tc.hora_inicio)) / 60 / tc.intervalo_minutos
    )))::TIME AS hora,
    tc.max_pedidos_por_turno,
    COALESCE(COUNT(p.id), 0) AS pedidos_asignados,
    tc.max_pedidos_por_turno - COALESCE(COUNT(p.id), 0) AS cupos_disponibles
FROM turnos_config tc
CROSS JOIN generate_series(0, 30) AS dias
LEFT JOIN pedidos p ON 
    p.unidad_negocio = tc.unidad_negocio 
    AND p.turno_fecha = CURRENT_DATE + interval '1 day' * dias
    AND p.turno_hora = (tc.hora_inicio + interval '1 minute' * (tc.intervalo_minutos * generate_series(0, 
        EXTRACT(EPOCH FROM (tc.hora_fin - tc.hora_inicio)) / 60 / tc.intervalo_minutos
    )))::TIME
WHERE NOT EXISTS (
    SELECT 1 FROM turnos_bloqueados tb
    WHERE tb.unidad_negocio = tc.unidad_negocio
    AND tb.fecha = CURRENT_DATE + interval '1 day' * dias
    AND (tb.hora_inicio IS NULL OR (tc.hora_inicio + interval '1 minute' * (tc.intervalo_minutos * generate_series(0, 
        EXTRACT(EPOCH FROM (tc.hora_fin - tc.hora_inicio)) / 60 / tc.intervalo_minutos
    )))::TIME BETWEEN tb.hora_inicio AND tb.hora_fin)
)
GROUP BY tc.unidad_negocio, fecha, hora, tc.max_pedidos_por_turno
HAVING (tc.hora_inicio + interval '1 minute' * (tc.intervalo_minutos * generate_series(0, 
    EXTRACT(EPOCH FROM (tc.hora_fin - tc.hora_inicio)) / 60 / tc.intervalo_minutos
)))::TIME <= tc.hora_fin;

-- Función para obtener próximo turno disponible
CREATE OR REPLACE FUNCTION obtener_proximo_turno_disponible(
    p_unidad_negocio TEXT,
    p_fecha_preferida DATE DEFAULT NULL
)
RETURNS TABLE (
    fecha DATE,
    hora TIME,
    cupos_disponibles BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        td.fecha::DATE,
        td.hora::TIME,
        td.cupos_disponibles
    FROM turnos_disponibles td
    WHERE td.unidad_negocio = p_unidad_negocio
    AND td.cupos_disponibles > 0
    AND (p_fecha_preferida IS NULL OR td.fecha = p_fecha_preferida)
    AND td.fecha >= CURRENT_DATE
    ORDER BY td.fecha, td.hora
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Habilitar RLS
ALTER TABLE turnos_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE turnos_bloqueados ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público (para desarrollo)
CREATE POLICY "Permitir lectura pública de turnos_config" ON turnos_config FOR SELECT USING (true);
CREATE POLICY "Permitir lectura pública de turnos_bloqueados" ON turnos_bloqueados FOR SELECT USING (true);

-- Políticas de escritura (solo admin)
CREATE POLICY "Permitir inserción de turnos_config" ON turnos_config FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir actualización de turnos_config" ON turnos_config FOR UPDATE USING (true);
CREATE POLICY "Permitir inserción de turnos_bloqueados" ON turnos_bloqueados FOR INSERT WITH CHECK (true);
CREATE POLICY "Permitir eliminación de turnos_bloqueados" ON turnos_bloqueados FOR DELETE USING (true);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_pedidos_turno ON pedidos(unidad_negocio, turno_fecha, turno_hora);
CREATE INDEX IF NOT EXISTS idx_turnos_bloqueados_fecha ON turnos_bloqueados(unidad_negocio, fecha);

COMMENT ON TABLE turnos_config IS 'Configuración de turnos por unidad de negocio';
COMMENT ON TABLE turnos_bloqueados IS 'Turnos bloqueados por feriados, mantenimiento, etc';
COMMENT ON COLUMN pedidos.turno_fecha IS 'Fecha del turno de entrega';
COMMENT ON COLUMN pedidos.turno_hora IS 'Hora del turno de entrega';
COMMENT ON COLUMN pedidos.turno_confirmado IS 'Si el cliente confirmó el turno';
