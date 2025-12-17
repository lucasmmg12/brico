# ✅ Implementación Completada - Sistema Brico

## Resumen de Cambios Implementados

### ✅ Componente 0: FIX CRÍTICO - Selección de Turno (COMPLETADO)

**Problema resuelto**: La página de selección de turnos ya no crea pedidos duplicados.

**Archivos modificados**:
1. `edge-function-v2-builderbot.ts`:
   - Ahora incluye `pedido_id` en el link de selección de turnos
   - Link: `?pedido_id=xxx&unidad=Mayorista`

2. `seleccionar-turno.js`:
   - Cambiado de `INSERT` a `UPDATE`
   - Lee `pedido_id` de la URL
   - Si no viene `pedido_id`, busca por teléfono como fallback
   - Solo actualiza campos: `turno_fecha`, `turno_hora`, `turno_confirmado`

**Resultado**: Los clientes ahora actualizan su pedido existente en lugar de crear uno nuevo.

---

### ✅ Componente 1: Base de Datos (ARCHIVO SQL CREADO)

**Archivo creado**: `supabase-migration-turnos-v2.sql`

**Cambios a ejecutar en Supabase**:
```sql
-- 1. Permitir 2 pedidos por horario
UPDATE turnos_config SET max_pedidos_por_turno = 2;

-- 2. Índice para búsquedas por teléfono
CREATE INDEX idx_pedidos_telefono ON pedidos(cliente_telefono);

-- 3. Columnas para información de sucursal
ALTER TABLE pedidos 
ADD COLUMN sucursal_direccion TEXT,
ADD COLUMN sucursal_maps_url TEXT;
```

**⚠️ ACCIÓN REQUERIDA**: Ejecutar este script en Supabase SQL Editor.

---

### ✅ Componente 4: Turnos Desde Mañana (COMPLETADO)

**Cambio de lógica**: De "+4 horas desde ahora" a "primer turno disponible mañana"

**Archivos modificados**:
1. `seleccionar-turno.js`:
   - Eliminado `HORAS_ANTICIPACION: 4`
   - Nueva función `calcularHoraMinima()`: Mañana a las 9 AM
   
2. `edge-function-v2-builderbot.ts`:
   - Mensaje actualizado: "Turnos disponibles desde mañana"

**Resultado**: 
- Pedido hoy a las 10 AM → Turnos desde mañana 9 AM
- Pedido hoy a las 23:00 → Turnos desde mañana 9 AM

---

### ✅ Componente 7: Mostrar Turno en Dashboard (COMPLETADO)

**Nueva columna "Turno" en la tabla**

**Archivos modificados**:
1. `index.html`:
   - Agregada columna `<th>Turno</th>`
   - Actualizado `colspan="9"`

2. `app-v3.js`:
   - Nueva función `formatearTurno(pedido)`
   - Muestra fecha/hora del turno
   - Badges: "SIN TURNO", "HOY", "MAÑANA"

3. `styles-v3.css`:
   - Estilos para `.col-turno`
   - Estilos para badges de turno

**Resultado**: El dashboard ahora muestra cuándo el cliente retirará su pedido.

---

## 📋 Componentes Pendientes de Implementación

### 🔶 Componente 2: Detección de Número de Teléfono

**Objetivo**: Buscar pedido existente por teléfono y usar su sucursal.

**Cambios necesarios en `edge-function-v2-builderbot.ts`**:
```typescript
// Después de línea 43, antes de llamar a OpenAI
const { data: pedidosExistentes } = await supabaseClient
    .from('pedidos')
    .select('unidad_negocio, cliente_nombre')
    .eq('cliente_telefono', body.cliente_telefono)
    .order('created_at', { ascending: false })
    .limit(1);

let unidadNegocioDetectada = 'Mayorista'; // Default
if (pedidosExistentes && pedidosExistentes.length > 0) {
    unidadNegocioDetectada = pedidosExistentes[0].unidad_negocio;
    console.log(`📱 Cliente existente: ${unidadNegocioDetectada}`);
}

// Usar unidadNegocioDetectada al crear el pedido
```

---

### 🔶 Componente 3: Detección de Sucursal por Dirección

**Objetivo**: Asignar sucursal según la dirección del cliente.

**Cambios necesarios**:
1. Actualizar prompt de OpenAI para extraer dirección
2. Lógica de asignación de sucursal
3. Incluir dirección y Google Maps en mensaje

**Código sugerido**:
```typescript
// Determinar sucursal por dirección
let sucursalFinal = unidadNegocioDetectada;
let direccionSucursal = '';
let mapsSucursal = '';

if (datosExtraidos.direccion_cliente) {
    const direccionLower = datosExtraidos.direccion_cliente.toLowerCase();
    if (direccionLower.includes('centro') || direccionLower.includes('sur')) {
        sucursalFinal = 'Express';
    }
}

// Asignar dirección
if (sucursalFinal === 'Mayorista') {
    direccionSucursal = 'Blvd. Sarmiento Oeste 907, J5425 Rawson, San Juan';
    mapsSucursal = 'https://maps.app.goo.gl/yEKrND9653A6D6Wn6';
} else {
    direccionSucursal = 'ESPAÑA Y, Dr. Ortega 502 SUR, J5425 RAWSON, San Juan';
    mapsSucursal = 'https://maps.app.goo.gl/wfv6Gw7uP6RgKExg6';
}

// Actualizar mensaje
const mensaje = `✅ *Pedido Confirmado - Grupo Brico*\n\n` +
    `Hola ${datosExtraidos.cliente_nombre}! 👋\n\n` +
    `Tu pedido de *${datosExtraidos.promo_seleccionada}* ha sido confirmado.\n` +
    `💰 Monto: $${datosExtraidos.monto?.toLocaleString('es-AR') || '0'}\n\n` +
    `📍 *Retirá tu pedido en:*\n` +
    `${direccionSucursal}\n` +
    `🗺️ ${mapsSucursal}\n\n` +
    `📅 *Elegí tu turno de retiro:*\n` +
    `👉 ${linkTurno}\n\n` +
    `⏰ Turnos disponibles desde mañana\n` +
    `🆔 Recordá traer tu DNI`;
```

---

### 🔶 Componente 5: Webhook para Express

**Objetivo**: Crear webhook separado para Express.

**Pasos**:
1. Duplicar `edge-function-v2-builderbot.ts` → `edge-function-express-builderbot.ts`
2. Cambiar `unidad_negocio` default a `'Express'`
3. Desplegar en Supabase:
   ```bash
   supabase functions deploy crear-pedido-express
   ```
4. Configurar en BuilderBot con nueva URL

---

### 🔶 Componente 6: Manejo de Imágenes de Comprobante

**Objetivo**: Subir imagen del webhook a Supabase Storage.

**Pregunta pendiente**: ¿En qué formato llega el campo `comprobante` desde BuilderBot?
- ¿Base64?
- ¿URL de imagen?
- ¿Objeto con URL?

**Código sugerido** (agregar a `edge-function-v2-builderbot.ts`):
```typescript
async function subirComprobanteAStorage(imagenData, clienteTelefono, supabaseClient) {
    try {
        // Detectar formato y convertir a buffer
        let imageBuffer;
        if (typeof imagenData === 'string' && imagenData.startsWith('data:image')) {
            // Base64
            const base64Data = imagenData.split(',')[1];
            imageBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
        } else if (typeof imagenData === 'string' && imagenData.startsWith('http')) {
            // URL
            const response = await fetch(imagenData);
            imageBuffer = new Uint8Array(await response.arrayBuffer());
        }

        const fileName = `comprobante_${clienteTelefono}_${Date.now()}.jpg`;
        
        const { data, error } = await supabaseClient.storage
            .from('comprobantes')
            .upload(fileName, imageBuffer, { contentType: 'image/jpeg' });

        if (error) throw error;

        const { data: urlData } = supabaseClient.storage
            .from('comprobantes')
            .getPublicUrl(fileName);

        return urlData.publicUrl;
    } catch (error) {
        console.error('Error al subir imagen:', error);
        return null;
    }
}

// En el handler principal
let comprobanteUrl = null;
if (body.comprobante) {
    comprobanteUrl = await subirComprobanteAStorage(
        body.comprobante,
        body.cliente_telefono,
        supabaseClient
    );
}

// Al crear el pedido
comprobante_url: comprobanteUrl
```

---

## 🚀 Pasos para Completar la Implementación

### 1. Ejecutar Script SQL en Supabase
```bash
# Ir a Supabase Dashboard → SQL Editor
# Copiar y ejecutar: supabase-migration-turnos-v2.sql
```

### 2. Desplegar Edge Function Actualizada
```bash
# Desde la carpeta del proyecto
supabase functions deploy crear-pedido-whatsapp
```

### 3. Desplegar a Vercel
```bash
# Hacer commit de los cambios
git add .
git commit -m "feat: Implement appointment system improvements"
git push origin master

# Vercel desplegará automáticamente
```

### 4. Verificar en Producción
- [ ] Crear pedido de prueba desde WhatsApp
- [ ] Verificar que el link incluye `pedido_id`
- [ ] Seleccionar turno y verificar que NO crea pedido duplicado
- [ ] Verificar que turnos solo están disponibles desde mañana
- [ ] Verificar que el dashboard muestra la columna "Turno"
- [ ] Verificar que se pueden asignar 2 turnos al mismo horario

---

## ⚠️ Preguntas Pendientes para Continuar

1. **Formato de imagen en webhook**: ¿Cómo llega el campo `comprobante`?
2. **Prioridad de sucursal**: ¿Teléfono o dirección tiene prioridad?
3. **Reglas de asignación**: ¿Qué zonas van a cada sucursal?

---

## 📊 Estado de Implementación

| Componente | Estado | Prioridad |
|------------|--------|-----------|
| 0. Fix selección de turno | ✅ Completado | CRÍTICO |
| 1. Base de datos | ⚠️ SQL creado, pendiente ejecutar | ALTA |
| 2. Detección por teléfono | 🔶 Pendiente | MEDIA |
| 3. Detección por dirección | 🔶 Pendiente | MEDIA |
| 4. Turnos desde mañana | ✅ Completado | ALTA |
| 5. Webhook Express | 🔶 Pendiente | BAJA |
| 6. Imágenes de comprobante | 🔶 Pendiente (falta info) | MEDIA |
| 7. Mostrar turno en dashboard | ✅ Completado | ALTA |

---

## 🎯 Próximos Pasos Recomendados

1. **Ejecutar SQL en Supabase** (5 minutos)
2. **Desplegar a Vercel** (automático)
3. **Probar flujo completo** (10 minutos)
4. **Responder preguntas pendientes** para continuar con componentes 2, 3, 5 y 6
