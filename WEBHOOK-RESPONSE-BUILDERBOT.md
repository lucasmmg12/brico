# 🔄 Edge Function - Versión con Webhook Response

## 📋 Cambios Necesarios

Para que BuilderBot envíe automáticamente el mensaje, la Edge Function debe **devolver** el mensaje en la respuesta del webhook en lugar de hacer un POST separado.

---

## 💻 Código Actualizado

Reemplaza las líneas 88-112 de `crear-pedido-whatsapp/index.ts` con:

```typescript
        console.log('✅ Pedido creado:', pedido[0]);

        // Generar link de selección de turno
        const linkTurno = `https://brico-dashboard.vercel.app/seleccionar-turno.html?unidad=${datosExtraidos.unidad_negocio || 'Mayorista'}`;

        // Preparar mensaje para BuilderBot
        const mensaje = `✅ *Pedido Confirmado - Grupo Brico*\n\n` +
            `Hola ${datosExtraidos.cliente_nombre}! 👋\n\n` +
            `Tu pedido de *${datosExtraidos.promo_seleccionada}* ha sido confirmado.\n` +
            `💰 Monto: $${datosExtraidos.monto?.toLocaleString('es-AR') || '0'}\n\n` +
            `📅 *Ahora elegí tu turno de retiro:*\n` +
            `👉 ${linkTurno}\n\n` +
            `⏰ Turnos disponibles desde +4 horas\n` +
            `🆔 Recordá traer tu DNI`;

        // Devolver respuesta con el mensaje para BuilderBot
        return new Response(
            JSON.stringify({ 
                success: true,
                message: mensaje,  // BuilderBot enviará este mensaje automáticamente
                pedido: pedido[0],
                datosExtraidos,
                linkTurno
            }),
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
```

---

## 🔧 Configuración en BuilderBot

### En el flujo de BuilderBot:

1. **Recopilar conversación** del cliente
2. **Enviar webhook** a Supabase:
   ```
   POST https://fhfacchqwvzpkmxlleri.supabase.co/functions/v1/crear-pedido-whatsapp
   ```
3. **Leer respuesta** del webhook
4. **Extraer campo `message`** de la respuesta JSON
5. **Enviar mensaje** al cliente automáticamente

---

## 📊 Ejemplo de Respuesta del Webhook:

```json
{
  "success": true,
  "message": "✅ *Pedido Confirmado - Grupo Brico*\n\nHola Lucas Marinero! 👋\n\nTu pedido de *PROMO 1 XL (Paleta Azul)* ha sido confirmado.\n💰 Monto: $15.000\n\n📅 *Ahora elegí tu turno de retiro:*\n👉 https://brico-dashboard.vercel.app/seleccionar-turno.html?unidad=Mayorista\n\n⏰ Turnos disponibles desde +4 horas\n🆔 Recordá traer tu DNI",
  "pedido": {
    "id": "...",
    "cliente_nombre": "Lucas Marinero",
    ...
  },
  "datosExtraidos": {
    "cliente_nombre": "Lucas Marinero",
    "promo_seleccionada": "PROMO 1 XL (Paleta Azul)",
    "monto": 15000
  },
  "linkTurno": "https://brico-dashboard.vercel.app/seleccionar-turno.html?unidad=Mayorista"
}
```

---

## ✅ Ventajas de este Enfoque:

1. ✅ **Más simple**: Un solo request
2. ✅ **Más rápido**: No hay segundo POST
3. ✅ **Más confiable**: BuilderBot maneja el envío
4. ✅ **Menos código**: No necesitas `enviarMensajeBuilderBot()`

---

## 🔄 Flujo Completo:

```
Cliente → BuilderBot → Webhook (POST)
                           ↓
                    OpenAI extrae datos
                           ↓
                    Crea pedido en Supabase
                           ↓
                    Devuelve JSON con "message"
                           ↓
BuilderBot ← Lee "message" de respuesta
    ↓
Cliente ← Recibe mensaje con link
```

---

## 🧪 Probar:

```powershell
powershell -ExecutionPolicy Bypass -File test-webhook-simple.ps1
```

La respuesta ahora incluirá el campo `message` que BuilderBot puede usar directamente.

---

## 📝 Nota:

Si prefieres mantener el POST separado (Opción 2), el código actual ya funciona. Esta es solo una alternativa más simple.
