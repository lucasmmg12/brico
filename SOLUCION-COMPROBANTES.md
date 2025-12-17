# 🔧 Solución: No se ven los comprobantes

## 📋 Diagnóstico del Problema

**Síntoma**: Los pedidos aparecen en el dashboard pero **no se ve el botón "📄 Ver"** para los comprobantes.

**Causa**: La Edge Function actualizada (que guarda `comprobante_url`) **no se ha desplegado a Supabase todavía**.

Los pedidos actuales en la base de datos fueron creados con la versión anterior de la Edge Function que **no guardaba** el campo `comprobante_url`.

---

## ✅ Solución

### Paso 1: Desplegar Edge Function Actualizada

**Opción A: Con Supabase CLI**
```bash
# Crear estructura de carpetas si no existe
mkdir -p supabase\functions\crear-pedido-whatsapp

# Copiar archivo actualizado
copy edge-function-v2-builderbot.ts supabase\functions\crear-pedido-whatsapp\index.ts

# Desplegar
supabase functions deploy crear-pedido-whatsapp
```

**Opción B: Desde Supabase Dashboard**
1. Ir a https://supabase.com/dashboard/project/fhfacchqwvzpkmxlleri
2. Edge Functions → `crear-pedido-whatsapp`
3. Reemplazar código con el contenido de `edge-function-v2-builderbot.ts`
4. Click en **"Deploy"**

---

### Paso 2: Verificar Despliegue

Buscar en los logs de la Edge Function:
- `📸 Comprobante detectado: https://...` ← Este mensaje debe aparecer

---

### Paso 3: Crear Pedido de Prueba

1. Enviar un pedido desde WhatsApp con comprobante
2. Verificar en logs que aparezca: `📸 Comprobante detectado`
3. Ir al dashboard
4. Verificar que aparezca el botón "📄 Ver"

---

## 🔍 Verificar en Base de Datos

Ejecutar en Supabase SQL Editor:

```sql
-- Ver últimos pedidos con estado de comprobante
SELECT 
    id,
    created_at,
    cliente_nombre,
    comprobante_url,
    CASE 
        WHEN comprobante_url IS NOT NULL THEN '✅ Tiene comprobante'
        ELSE '❌ Sin comprobante'
    END as estado
FROM pedidos
ORDER BY created_at DESC
LIMIT 10;
```

**Resultado esperado:**
- Pedidos antiguos: `❌ Sin comprobante` (creados antes del despliegue)
- Pedidos nuevos: `✅ Tiene comprobante` (creados después del despliegue)

---

## 🎯 Flujo Correcto

### Antes del despliegue:
1. Cliente envía comprobante por WhatsApp
2. Webhook llega con `body.urlTempFile`
3. Edge Function **NO guarda** `comprobante_url` ❌
4. Dashboard **NO muestra** botón "📄 Ver" ❌

### Después del despliegue:
1. Cliente envía comprobante por WhatsApp
2. Webhook llega con `body.urlTempFile`
3. Edge Function **guarda** `comprobante_url` ✅
4. Log: `📸 Comprobante detectado: https://...`
5. Dashboard **muestra** botón "📄 Ver" ✅
6. Al hacer clic → se abre modal con la imagen

---

## 🐛 Troubleshooting

### Problema: Desplegué pero sigue sin aparecer el botón

**Verificar:**
1. ¿El pedido es nuevo (creado después del despliegue)?
2. ¿El webhook envió `urlTempFile`?
3. ¿Los logs muestran "📸 Comprobante detectado"?

**Solución:**
- Crear un pedido **nuevo** de prueba
- Los pedidos antiguos no tendrán comprobante

---

### Problema: Los logs no muestran "📸 Comprobante detectado"

**Causa**: El webhook no está enviando `urlTempFile`

**Verificar en logs:**
```
📥 Webhook recibido: { ... }
```

Buscar en el JSON si existe `urlTempFile`

**Solución:**
- Verificar configuración de BuilderBot
- Asegurarse que el flujo incluya la imagen

---

### Problema: El botón aparece pero la imagen no carga

**Causa**: URL del comprobante inválida o expirada

**Verificar:**
1. Copiar la URL de `comprobante_url` de la base de datos
2. Pegarla en el navegador
3. ¿Se ve la imagen?

**Solución:**
- Si la URL expira, considerar subir a Supabase Storage
- Ver `IMPLEMENTACION-COMPLETADA.md` → Componente 6

---

## 📊 Estado Actual vs Estado Deseado

### Estado Actual (antes de desplegar):
```
Pedido en DB:
{
  id: "abc123",
  cliente_nombre: "Lucas Marinero",
  comprobante_url: null  ❌
}

Dashboard:
[Cliente] [Teléfono] [Promo] [Turno] [Monto] [Estado] [✅ Listo]
                                                      ↑ NO hay botón de comprobante
```

### Estado Deseado (después de desplegar):
```
Pedido en DB:
{
  id: "abc123",
  cliente_nombre: "Lucas Marinero",
  comprobante_url: "https://runtime-sessions.s3.us-west-1.amazonaws.com/..."  ✅
}

Dashboard:
[Cliente] [Teléfono] [Promo] [Turno] [Monto] [Estado] [📄 Ver] [✅ Listo]
                                                       ↑ Botón aparece!
```

---

## 🚀 Próximos Pasos

1. ✅ Desplegar Edge Function actualizada
2. ✅ Crear pedido de prueba con comprobante
3. ✅ Verificar logs: `📸 Comprobante detectado`
4. ✅ Verificar en DB: `comprobante_url` tiene valor
5. ✅ Verificar en dashboard: aparece botón "📄 Ver"
6. ✅ Hacer clic en botón → ver imagen

---

## 💡 Nota Importante

**Los pedidos existentes NO tendrán comprobante** porque fueron creados con la versión anterior de la Edge Function.

Solo los **pedidos nuevos** (creados después del despliegue) tendrán el botón de comprobante.

Si necesitas agregar comprobantes a pedidos existentes, puedes:
1. Editarlos manualmente desde el dashboard
2. O ejecutar un UPDATE en la base de datos con las URLs
