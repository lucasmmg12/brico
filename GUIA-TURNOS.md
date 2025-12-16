# 📅 Sistema de Gestión de Turnos de Entrega

## 🎯 Descripción

Sistema completo para gestionar turnos de entrega de pedidos con slots de 10 minutos de 09:00 a 23:00 hs.

---

## 🚀 Implementación

### Paso 1: Ejecutar Script SQL en Supabase

1. Ve a: https://supabase.com/dashboard/project/fhfacchqwvzpkmxlleri/editor
2. Abre el **SQL Editor**
3. Copia y pega el contenido de `supabase-turnos.sql`
4. Ejecuta el script

Esto creará:
- ✅ Campos `turno_fecha`, `turno_hora`, `turno_confirmado` en tabla `pedidos`
- ✅ Tabla `turnos_config` (configuración por unidad de negocio)
- ✅ Tabla `turnos_bloqueados` (para feriados/mantenimiento)
- ✅ Vista `turnos_disponibles` (turnos con cupos disponibles)
- ✅ Función `obtener_proximo_turno_disponible()`

### Paso 2: Configurar Turnos

La configuración por defecto es:
- **Horario**: 09:00 a 23:00
- **Intervalo**: 10 minutos
- **Cupos por turno**: 3 pedidos
- **Días hábiles**: Todos los días

Para modificar:
```sql
UPDATE turnos_config 
SET 
    hora_inicio = '10:00',
    hora_fin = '22:00',
    intervalo_minutos = 15,
    max_pedidos_por_turno = 5
WHERE unidad_negocio = 'Mayorista';
```

### Paso 3: Acceder al Calendario

Una vez desplegado en Vercel:
- **URL**: https://tu-proyecto.vercel.app/calendario.html
- O desde el Dashboard → Botón "📅 Calendario"

---

## 📋 Funcionalidades

### 1️⃣ Vista de Calendario

- **Selector de fecha**: Navega entre días
- **Tabs Mayorista/Express**: Cada sucursal tiene su calendario
- **Grid de turnos**: Vista de todos los slots del día
- **Estados visuales**:
  - 🟢 **Verde**: Turno disponible (0 pedidos)
  - 🟠 **Naranja**: Turno parcial (1-2 pedidos)
  - 🔴 **Rojo**: Turno completo (3 pedidos)

### 2️⃣ Estadísticas del Día

- Total de turnos
- Turnos ocupados
- Turnos disponibles
- Pedidos a entregar

### 3️⃣ Detalles del Turno

Click en cualquier turno para ver:
- Lista de pedidos asignados
- Datos del cliente
- Estado del pedido
- Cupos disponibles

---

## 🔧 Asignar Turno a un Pedido

### Opción A: Desde el Dashboard

Cuando crees o edites un pedido, agrega:
- **Fecha de turno**: `turno_fecha`
- **Hora de turno**: `turno_hora`

### Opción B: Desde WhatsApp (Webhook)

Modifica el webhook para asignar automáticamente el próximo turno disponible:

```javascript
// En crear-pedido-whatsapp/index.ts

// Obtener próximo turno disponible
const { data: turnoDisponible } = await supabaseClient
  .rpc('obtener_proximo_turno_disponible', {
    p_unidad_negocio: body.unidad_negocio,
    p_fecha_preferida: body.fecha_entrega || null
  });

const pedidoData = {
  // ... otros campos
  turno_fecha: turnoDisponible[0]?.fecha || null,
  turno_hora: turnoDisponible[0]?.hora || null,
  turno_confirmado: false
};
```

### Opción C: Asignación Manual

```sql
UPDATE pedidos 
SET 
    turno_fecha = '2025-12-20',
    turno_hora = '14:30:00',
    turno_confirmado = true
WHERE id = 'pedido-uuid';
```

---

## 🚫 Bloquear Turnos (Feriados/Mantenimiento)

### Bloquear un día completo:

```sql
INSERT INTO turnos_bloqueados (unidad_negocio, fecha, motivo)
VALUES ('Mayorista', '2025-12-25', 'Navidad');
```

### Bloquear rango horario:

```sql
INSERT INTO turnos_bloqueados (unidad_negocio, fecha, hora_inicio, hora_fin, motivo)
VALUES ('Express', '2025-12-31', '20:00', '23:00', 'Año Nuevo - Cierre anticipado');
```

---

## 📊 Consultas Útiles

### Ver turnos del día:

```sql
SELECT 
    turno_hora,
    COUNT(*) as pedidos,
    STRING_AGG(cliente_nombre, ', ') as clientes
FROM pedidos
WHERE turno_fecha = CURRENT_DATE
AND unidad_negocio = 'Mayorista'
GROUP BY turno_hora
ORDER BY turno_hora;
```

### Ver turnos disponibles hoy:

```sql
SELECT * FROM turnos_disponibles
WHERE fecha = CURRENT_DATE
AND unidad_negocio = 'Mayorista'
AND cupos_disponibles > 0
ORDER BY hora;
```

### Pedidos sin turno asignado:

```sql
SELECT * FROM pedidos
WHERE turno_fecha IS NULL
AND estado_pedido != 'entregado'
ORDER BY created_at DESC;
```

---

## 🎨 Personalización

### Cambiar colores de estados:

Edita `styles-calendario.css`:

```css
.turno-disponible {
    border-color: #tu-color;
}
```

### Cambiar intervalo de turnos:

```sql
UPDATE turnos_config 
SET intervalo_minutos = 15  -- 15 minutos en lugar de 10
WHERE unidad_negocio = 'Mayorista';
```

### Cambiar cupos por turno:

```sql
UPDATE turnos_config 
SET max_pedidos_por_turno = 5  -- 5 pedidos en lugar de 3
WHERE unidad_negocio = 'Express';
```

---

## 🔄 Próximas Mejoras (Opcional)

1. **Confirmación de turno por WhatsApp**
   - Enviar mensaje al cliente con su turno
   - Botón para confirmar/cambiar turno

2. **Notificaciones automáticas**
   - Recordatorio 1 hora antes del turno
   - Alerta si el pedido no está listo

3. **Vista semanal/mensual**
   - Calendario completo del mes
   - Estadísticas por semana

4. **Exportar calendario**
   - PDF con turnos del día
   - Excel con planificación semanal

---

## ✅ Checklist de Implementación

- [ ] Ejecutar `supabase-turnos.sql` en Supabase
- [ ] Verificar que se crearon las tablas
- [ ] Probar el calendario en local
- [ ] Desplegar en Vercel
- [ ] Asignar turnos a pedidos existentes
- [ ] Configurar bloqueos de feriados
- [ ] Capacitar al equipo en el uso del calendario

---

**¡El sistema de turnos está listo para usar!** 🎉

Para cualquier duda o personalización adicional, consulta la documentación de Supabase o contacta al equipo de desarrollo.
