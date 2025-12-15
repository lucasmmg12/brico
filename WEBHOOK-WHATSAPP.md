# 📱 Webhook WhatsApp → Brico Dashboard

## 🎯 Descripción

Este webhook permite crear pedidos automáticamente desde WhatsApp (BuilderBot) enviando los datos del cliente directamente a la base de datos.

---

## 🚀 Desplegar la Edge Function

### Paso 1: Instalar Supabase CLI

```bash
npm install -g supabase
```

### Paso 2: Login en Supabase

```bash
supabase login
```

### Paso 3: Link al proyecto

```bash
cd c:/Users/lucas/Desktop/Proyectos/brico
supabase link --project-ref fhfacchqwvzpkmxlleri
```

### Paso 4: Desplegar la función

```bash
supabase functions deploy crear-pedido-whatsapp
```

---

## 📍 URL del Webhook

Una vez desplegado, la URL será:

```
https://fhfacchqwvzpkmxlleri.supabase.co/functions/v1/crear-pedido-whatsapp
```

**Esta es la URL que debes configurar en BuilderBot.**

---

## 📨 Formato del Request (POST)

### Headers

```
Content-Type: application/json
Authorization: Bearer YOUR_SUPABASE_ANON_KEY
```

### Body (JSON)

```json
{
  "cliente_nombre": "Juan Pérez",
  "cliente_dni": "12345678",
  "cliente_telefono": "1123456789",
  "unidad_negocio": "Mayorista",
  "promo_seleccionada": "Promo 1 - Almacén Completo",
  "monto": 15000,
  "comprobante_url": "https://url-del-comprobante.jpg",
  "estado_pago": "pendiente",
  "fecha_entrega": "2025-12-20",
  "notas_internas": "Cliente contactado por WhatsApp"
}
```

### Campos Requeridos ✅

- `cliente_nombre` (string)
- `cliente_dni` (string)
- `unidad_negocio` (string: "Mayorista" o "Express")
- `promo_seleccionada` (string)
- `monto` (number)

### Campos Opcionales

- `cliente_telefono` (string)
- `comprobante_url` (string)
- `estado_pago` (string: "pendiente", "pagado", "rechazado") - Default: "pendiente"
- `fecha_entrega` (string: formato YYYY-MM-DD)
- `notas_internas` (string)

---

## 📤 Respuesta del Webhook

### Éxito (200)

```json
{
  "success": true,
  "message": "Pedido creado exitosamente",
  "pedido": {
    "id": "uuid-del-pedido",
    "cliente_nombre": "Juan Pérez",
    "created_at": "2025-12-15T20:10:00Z",
    ...
  }
}
```

### Error (400/500)

```json
{
  "success": false,
  "error": "Descripción del error"
}
```

---

## 🧪 Probar el Webhook

### Con cURL

```bash
curl -X POST https://fhfacchqwvzpkmxlleri.supabase.co/functions/v1/crear-pedido-whatsapp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "cliente_nombre": "Test Usuario",
    "cliente_dni": "99999999",
    "cliente_telefono": "1199999999",
    "unidad_negocio": "Express",
    "promo_seleccionada": "Promo Test",
    "monto": 1000
  }'
```

### Con Postman

1. **Method**: POST
2. **URL**: `https://fhfacchqwvzpkmxlleri.supabase.co/functions/v1/crear-pedido-whatsapp`
3. **Headers**:
   - `Content-Type`: `application/json`
   - `Authorization`: `Bearer YOUR_ANON_KEY`
4. **Body** (raw JSON): Copiar el ejemplo de arriba

---

## 🤖 Configuración en BuilderBot

### Ejemplo de código BuilderBot

```javascript
const { addKeyword } = require('@bot-whatsapp/bot')

const flujoCrearPedido = addKeyword(['pedido', 'comprar'])
  .addAnswer('¿Cuál es tu nombre completo?', { capture: true }, async (ctx, { flowDynamic, state }) => {
    await state.update({ nombre: ctx.body })
  })
  .addAnswer('¿Cuál es tu DNI?', { capture: true }, async (ctx, { flowDynamic, state }) => {
    await state.update({ dni: ctx.body })
  })
  .addAnswer('¿Qué unidad de negocio? (Mayorista/Express)', { capture: true }, async (ctx, { flowDynamic, state }) => {
    await state.update({ unidad: ctx.body })
  })
  .addAnswer('¿Qué promo elegiste?', { capture: true }, async (ctx, { flowDynamic, state }) => {
    await state.update({ promo: ctx.body })
  })
  .addAnswer('¿Cuánto pagaste?', { capture: true }, async (ctx, { flowDynamic, state }) => {
    await state.update({ monto: ctx.body })
  })
  .addAnswer('Envía el comprobante de pago', { capture: true }, async (ctx, { flowDynamic, state }) => {
    const currentState = state.getMyState()
    
    // Enviar datos al webhook
    const response = await fetch('https://fhfacchqwvzpkmxlleri.supabase.co/functions/v1/crear-pedido-whatsapp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_ANON_KEY'
      },
      body: JSON.stringify({
        cliente_nombre: currentState.nombre,
        cliente_dni: currentState.dni,
        cliente_telefono: ctx.from,
        unidad_negocio: currentState.unidad,
        promo_seleccionada: currentState.promo,
        monto: parseFloat(currentState.monto),
        comprobante_url: ctx.message?.imageMessage?.url || null
      })
    })
    
    const result = await response.json()
    
    if (result.success) {
      await flowDynamic('✅ ¡Pedido creado exitosamente! Tu pedido está siendo procesado.')
    } else {
      await flowDynamic('❌ Hubo un error al crear el pedido. Por favor, contacta con soporte.')
    }
  })

module.exports = flujoCrearPedido
```

---

## 🔐 Seguridad

### Anon Key vs Service Role Key

- **Anon Key**: Usar en BuilderBot (segura para cliente)
- **Service Role Key**: Solo para la Edge Function (bypass RLS)

La Edge Function usa automáticamente la Service Role Key internamente, por lo que BuilderBot solo necesita la Anon Key.

---

## 📊 Monitoreo

### Ver logs de la función

```bash
supabase functions logs crear-pedido-whatsapp
```

### En Supabase Dashboard

1. Ve a **Edge Functions**
2. Selecciona `crear-pedido-whatsapp`
3. Ve a la pestaña **Logs**

---

## ✅ Checklist de Implementación

- [ ] Instalar Supabase CLI
- [ ] Desplegar la Edge Function
- [ ] Probar con cURL o Postman
- [ ] Configurar BuilderBot con la URL del webhook
- [ ] Probar flujo completo desde WhatsApp
- [ ] Verificar que los pedidos aparecen en el dashboard

---

## 🆘 Troubleshooting

### Error: "Missing required fields"
- Verifica que estés enviando todos los campos requeridos
- Revisa que los nombres de los campos coincidan exactamente

### Error: "unidad_negocio debe ser Mayorista o Express"
- Asegúrate de enviar exactamente "Mayorista" o "Express" (con mayúscula)

### Error 401: Unauthorized
- Verifica que estés enviando el header `Authorization` con la Anon Key correcta

### Los pedidos no aparecen en el dashboard
- Verifica que la función se haya desplegado correctamente
- Revisa los logs de la función
- Verifica que las políticas RLS permitan inserción

---

**¡Listo! Ahora puedes crear pedidos desde WhatsApp automáticamente.** 🎉
