# 🤖 Integración BuilderBot + OpenAI + Brico Dashboard

## 🎯 Flujo Completo

```
Cliente WhatsApp
    ↓
BuilderBot (recopila conversación)
    ↓
Webhook 1: Supabase Edge Function
    ↓
OpenAI (extrae datos del chat)
    ↓
Crea pedido en Supabase
    ↓
Webhook 2: Responde a BuilderBot
    ↓
Cliente recibe link de selección de turno
```

---

## 📋 Configuración en BuilderBot (Make.com)

### Paso 1: Webhook de Entrada (BuilderBot → Supabase)

**URL del Webhook**:
```
https://fhfacchqwvzpkmxlleri.supabase.co/functions/v1/crear-pedido-whatsapp
```

**Método**: `POST`

**Headers**:
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoZmFjY2hxd3Z6cGtteGxsZXJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQzMTQ5MjQsImV4cCI6MjA0OTg5MDkyNH0.hNMOdCGTyuPbNOILgxsxkZWPtYPNLjlPXaOPLGcZQzU"
}
```

**Body** (JSON):
```json
{
  "historial": [
    {
      "from": "Cliente",
      "body": "Hola, quiero comprar la PROMO 1 XL"
    },
    {
      "from": "Agente",
      "body": "Perfecto! ¿Cuál es tu nombre?"
    },
    {
      "from": "Cliente",
      "body": "Lucas Marinero"
    },
    {
      "from": "Agente",
      "body": "¿Y tu DNI?"
    },
    {
      "from": "Cliente",
      "body": "12345678"
    }
  ],
  "cliente_telefono": "5492645438114"
}
```

**O formato alternativo** (texto plano):
```json
{
  "historial": "Cliente: Hola, quiero comprar la PROMO 1 XL\nAgente: Perfecto! ¿Cuál es tu nombre?\nCliente: Lucas Marinero\nAgente: ¿Y tu DNI?\nCliente: 12345678",
  "cliente_telefono": "5492645438114"
}
```

---

## 🔧 Configuración en Make.com

### Módulo 1: Webhook (Custom Webhook)

1. **Trigger**: Cuando se completa la conversación en BuilderBot
2. **Action**: HTTP Request
3. **URL**: `https://fhfacchqwvzpkmxlleri.supabase.co/functions/v1/crear-pedido-whatsapp`
4. **Method**: POST
5. **Headers**:
   - `Content-Type`: `application/json`
   - `Authorization`: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
6. **Body**:
   ```json
   {
     "historial": {{array_de_mensajes}},
     "cliente_telefono": {{telefono_cliente}}
   }
   ```

### Módulo 2: OpenAI (dentro de la Edge Function)

- ✅ Ya está configurado en la Edge Function
- ✅ Usa GPT-4o-mini para extraer datos
- ✅ Prompt optimizado para extracción de datos

### Módulo 3: Webhook Response (automático)

- ✅ La Edge Function responde automáticamente a BuilderBot
- ✅ Envía mensaje con link de selección de turno

---

## 📊 Datos que OpenAI Extrae Automáticamente

```json
{
  "cliente_nombre": "Lucas Marinero",
  "cliente_dni": "12345678",
  "cliente_telefono": "5492645438114",
  "unidad_negocio": "Mayorista",
  "promo_seleccionada": "PROMO 1 XL (Paleta Azul)",
  "monto": 15000
}
```

---

## 🚀 Desplegar Edge Function en Supabase

### Opción 1: Desde Supabase Dashboard (Recomendado)

1. Ve a: https://supabase.com/dashboard/project/fhfacchqwvzpkmxlleri/functions
2. Click en "Create a new function"
3. Nombre: `crear-pedido-whatsapp`
4. Copia el código de `supabase/functions/crear-pedido-whatsapp/index.ts`
5. Deploy

### Opción 2: Desde CLI (Avanzado)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Login
supabase login

# Link al proyecto
supabase link --project-ref fhfacchqwvzpkmxlleri

# Deploy
supabase functions deploy crear-pedido-whatsapp
```

---

## 🧪 Probar el Webhook

### Desde PowerShell:

```powershell
$url = "https://fhfacchqwvzpkmxlleri.supabase.co/functions/v1/crear-pedido-whatsapp"
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
$body = @{
    historial = @(
        @{ from = "Cliente"; body = "Hola, quiero la PROMO 1 XL" },
        @{ from = "Agente"; body = "Perfecto! ¿Tu nombre?" },
        @{ from = "Cliente"; body = "Lucas Marinero" },
        @{ from = "Agente"; body = "¿Tu DNI?" },
        @{ from = "Cliente"; body = "12345678" }
    )
    cliente_telefono = "5492645438114"
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body
```

### Desde cURL:

```bash
curl -X POST \
  https://fhfacchqwvzpkmxlleri.supabase.co/functions/v1/crear-pedido-whatsapp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "historial": [
      {"from": "Cliente", "body": "Hola, quiero la PROMO 1 XL"},
      {"from": "Agente", "body": "Perfecto! ¿Tu nombre?"},
      {"from": "Cliente", "body": "Lucas Marinero"},
      {"from": "Agente", "body": "¿Tu DNI?"},
      {"from": "Cliente", "body": "12345678"}
    ],
    "cliente_telefono": "5492645438114"
  }'
```

---

## ✅ Checklist de Implementación

- [ ] Desplegar Edge Function en Supabase
- [ ] Configurar webhook en Make.com
- [ ] Probar con datos de prueba
- [ ] Verificar que se crea el pedido en Supabase
- [ ] Verificar que llega el mensaje a WhatsApp
- [ ] Probar flujo completo desde WhatsApp

---

## 🔍 Troubleshooting

### Error: "Invalid JWT"
- Verifica que la Edge Function esté desplegada
- Verifica el token de autorización

### Error: "No se pudieron extraer datos"
- Verifica que el historial tenga suficiente información
- Revisa los logs de OpenAI en la consola de Supabase

### No llega el mensaje de WhatsApp
- Verifica la API Key de BuilderBot
- Revisa los logs de la Edge Function

---

**¡El sistema está listo para procesar pedidos automáticamente!** 🎉
