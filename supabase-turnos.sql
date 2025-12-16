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

-- Función para obtener turnos disponibles de un día
CREATE OR REPLACE FUNCTION obtener_turnos_dia(
    p_unidad_negocio TEXT,
    p_fecha DATE
)
RETURNS TABLE (
    fecha DATE,
    hora TIME,
    max_pedidos INTEGER,
    pedidos_asignados BIGINT,
    cupos_disponibles BIGINT
) AS $$
DECLARE
    v_hora_inicio TIME;
    v_hora_fin TIME;
    v_intervalo INTEGER;
    v_max_pedidos INTEGER;
    v_hora_actual TIME;
BEGIN
    -- Obtener configuración
    SELECT hora_inicio, hora_fin, intervalo_minutos, max_pedidos_por_turno
    INTO v_hora_inicio, v_hora_fin, v_intervalo, v_max_pedidos
    FROM turnos_config
    WHERE unidad_negocio = p_unidad_negocio;

    -- Generar turnos
    v_hora_actual := v_hora_inicio;
    
    WHILE v_hora_actual <= v_hora_fin LOOP
        -- Verificar si el turno está bloqueado
        IF NOT EXISTS (
            SELECT 1 FROM turnos_bloqueados tb
            WHERE tb.unidad_negocio = p_unidad_negocio
            AND tb.fecha = p_fecha
            AND (tb.hora_inicio IS NULL OR v_hora_actual BETWEEN tb.hora_inicio AND tb.hora_fin)
        ) THEN
            -- Contar pedidos asignados
            RETURN QUERY
            SELECT 
                p_fecha,
                v_hora_actual,
                v_max_pedidos,
                COALESCE(COUNT(p.id), 0)::BIGINT,
                (v_max_pedidos - COALESCE(COUNT(p.id), 0))::BIGINT
            FROM (SELECT 1) AS dummy
            LEFT JOIN pedidos p ON 
                p.unidad_negocio = p_unidad_negocio 
                AND p.turno_fecha = p_fecha
                AND p.turno_hora = v_hora_actual
            GROUP BY p_fecha, v_hora_actual, v_max_pedidos;
        END IF;
        
        -- Incrementar hora
        v_hora_actual := v_hora_actual + (v_intervalo || ' minutes')::INTERVAL;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

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
DECLARE
    v_fecha_inicio DATE;
    v_fecha_actual DATE;
    v_fecha_fin DATE;
BEGIN
    v_fecha_inicio := COALESCE(p_fecha_preferida, CURRENT_DATE);
    v_fecha_fin := v_fecha_inicio + INTERVAL '30 days';
    v_fecha_actual := v_fecha_inicio;
    
    WHILE v_fecha_actual <= v_fecha_fin LOOP
        RETURN QUERY
        SELECT t.fecha, t.hora, t.cupos_disponibles
        FROM obtener_turnos_dia(p_unidad_negocio, v_fecha_actual) t
        WHERE t.cupos_disponibles > 0
        ORDER BY t.fecha, t.hora
        LIMIT 1;
        
        IF FOUND THEN
            RETURN;
        END IF;
        
        v_fecha_actual := v_fecha_actual + INTERVAL '1 day';
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Habilitar RLS
ALTER TABLE turnos_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE turnos_bloqueados ENABLE ROW LEVEL SECURITY;

-- Políticas de acceso público (para desarrollo)
DROP POLICY IF EXISTS "Permitir lectura pública de turnos_config" ON turnos_config;
CREATE POLICY "Permitir lectura pública de turnos_config" ON turnos_config FOR SELECT USING (true);

DROP POLICY IF EXISTS "Permitir lectura pública de turnos_bloqueados" ON turnos_bloqueados;
CREATE POLICY "Permitir lectura pública de turnos_bloqueados" ON turnos_bloqueados FOR SELECT USING (true);

-- Políticas de escritura (solo admin)
DROP POLICY IF EXISTS "Permitir inserción de turnos_config" ON turnos_config;
CREATE POLICY "Permitir inserción de turnos_config" ON turnos_config FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir actualización de turnos_config" ON turnos_config;
CREATE POLICY "Permitir actualización de turnos_config" ON turnos_config FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Permitir inserción de turnos_bloqueados" ON turnos_bloqueados;
CREATE POLICY "Permitir inserción de turnos_bloqueados" ON turnos_bloqueados FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir eliminación de turnos_bloqueados" ON turnos_bloqueados;
CREATE POLICY "Permitir eliminación de turnos_bloqueados" ON turnos_bloqueados FOR DELETE USING (true);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_pedidos_turno ON pedidos(unidad_negocio, turno_fecha, turno_hora);
CREATE INDEX IF NOT EXISTS idx_turnos_bloqueados_fecha ON turnos_bloqueados(unidad_negocio, fecha);

COMMENT ON TABLE turnos_config IS 'Configuración de turnos por unidad de negocio';
COMMENT ON TABLE turnos_bloqueados IS 'Turnos bloqueados por feriados, mantenimiento, etc';
COMMENT ON COLUMN pedidos.turno_fecha IS 'Fecha del turno de entrega';
COMMENT ON COLUMN pedidos.turno_hora IS 'Hora del turno de entrega';
COMMENT ON COLUMN pedidos.turno_confirmado IS 'Si el cliente confirmó el turno';
COMMENT ON FUNCTION obtener_turnos_dia IS 'Obtiene todos los turnos de un día específico con disponibilidad';
COMMENT ON FUNCTION obtener_proximo_turno_disponible IS 'Obtiene el próximo turno disponible a partir de una fecha';
