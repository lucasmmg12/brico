# 🚀 Despliegue de Edge Functions - Brico

## Webhooks Disponibles

Ahora tenemos **2 webhooks separados** para cada sucursal:

### 1. **Webhook Mayorista** 
- **Archivo**: `edge-function-v2-builderbot.ts`
- **Función Supabase**: `crear-pedido-whatsapp`
- **Unidad de Negocio**: Mayorista (default)
- **Mensaje**: "Pedido Confirmado - Grupo Brico"

### 2. **Webhook Express** 
- **Archivo**: `edge-function-express-builderbot.ts`
- **Función Supabase**: `crear-pedido-express`
- **Unidad de Negocio**: Express (hardcoded)
- **Mensaje**: "Pedido Confirmado - Brico Express"

---

## 📋 Pasos para Desplegar

### Opción A: Desplegar con Supabase CLI (Recomendado)

#### 1. Instalar Supabase CLI (si no lo tienes)
```bash
# Windows (PowerShell)
scoop install supabase

# O con npm
npm install -g supabase
```

#### 2. Login a Supabase
```bash
supabase login
```

#### 3. Link al proyecto
```bash
cd c:\Users\lucas\Desktop\Proyectos\brico
supabase link --project-ref fhfacchqwvzpkmxlleri
```

#### 4. Crear estructura de carpetas
```bash
# Crear carpeta para Edge Functions
mkdir -p supabase\functions\crear-pedido-whatsapp
mkdir -p supabase\functions\crear-pedido-express

# Copiar archivos
copy edge-function-v2-builderbot.ts supabase\functions\crear-pedido-whatsapp\index.ts
copy edge-function-express-builderbot.ts supabase\functions\crear-pedido-express\index.ts
```

#### 5. Desplegar ambas funciones
```bash
# Desplegar Mayorista
supabase functions deploy crear-pedido-whatsapp

# Desplegar Express
supabase functions deploy crear-pedido-express
```

---

### Opción B: Desplegar desde Supabase Dashboard

#### 1. Ir a Supabase Dashboard
- URL: https://supabase.com/dashboard/project/fhfacchqwvzpkmxlleri

#### 2. Navegar a Edge Functions
- Menú lateral → **Edge Functions**

#### 3. Crear función Mayorista
- Click en **"New Function"**
- Nombre: `crear-pedido-whatsapp`
- Copiar contenido de `edge-function-v2-builderbot.ts`
- Click en **"Deploy"**

#### 4. Crear función Express
- Click en **"New Function"**
- Nombre: `crear-pedido-express`
- Copiar contenido de `edge-function-express-builderbot.ts`
- Click en **"Deploy"**

---

## 🔧 Configurar Variables de Entorno

Ambas funciones usan las **mismas variables de entorno**:

### En Supabase Dashboard:
1. Ir a **Settings** → **Edge Functions** → **Secrets**
2. Agregar estas variables:

```
OPENAI_API_KEY=sk-proj-...
BUILDERBOT_API_URL=https://app.builderbot.cloud/api/v2/c13bbb6b-c2e5-4595-b5eb-7278b6139699/messages
BUILDERBOT_API_KEY=bb-ce91874a-ee62-40a3-8bc9-0d993145b081
SUPABASE_URL=https://fhfacchqwvzpkmxlleri.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 📡 URLs de los Webhooks

Una vez desplegadas, las URLs serán:

### Mayorista:
```
https://fhfacchqwvzpkmxlleri.supabase.co/functions/v1/crear-pedido-whatsapp
```

### Express:
```
https://fhfacchqwvzpkmxlleri.supabase.co/functions/v1/crear-pedido-express
```

---

## 🤖 Configurar en BuilderBot

### Para Mayorista:
1. Ir al flujo de BuilderBot para Mayorista
2. Agregar acción de Webhook
3. URL: `https://fhfacchqwvzpkmxlleri.supabase.co/functions/v1/crear-pedido-whatsapp`
4. Método: POST
5. Headers:
   - `Content-Type: application/json`
   - `apikey: [tu-supabase-anon-key]`

### Para Express:
1. Ir al flujo de BuilderBot para Express
2. Agregar acción de Webhook
3. URL: `https://fhfacchqwvzpkmxlleri.supabase.co/functions/v1/crear-pedido-express`
4. Método: POST
5. Headers:
   - `Content-Type: application/json`
   - `apikey: [tu-supabase-anon-key]`

---

## ✅ Verificar Despliegue

### Probar Mayorista:
```powershell
# Desde PowerShell
$body = @{
    historial = @(
        @{ role = "user"; content = "Hola" }
        @{ role = "assistant"; content = "Hola! Quiero la promo 1" }
    )
    cliente_telefono = "5492645123456"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://fhfacchqwvzpkmxlleri.supabase.co/functions/v1/crear-pedido-whatsapp" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"; "apikey"="[tu-key]"} `
    -Body $body
```

### Probar Express:
```powershell
# Cambiar la URL a crear-pedido-express
Invoke-RestMethod -Uri "https://fhfacchqwvzpkmxlleri.supabase.co/functions/v1/crear-pedido-express" `
    -Method POST `
    -Headers @{"Content-Type"="application/json"; "apikey"="[tu-key]"} `
    -Body $body
```

---

## 🔍 Ver Logs

### En Supabase Dashboard:
1. Ir a **Edge Functions**
2. Click en la función (crear-pedido-whatsapp o crear-pedido-express)
3. Click en **"Logs"**
4. Ver logs en tiempo real

### Buscar en logs:
- `📥 Webhook recibido` - Webhook llegó correctamente
- `📥 Webhook EXPRESS recibido` - Webhook Express llegó
- `📸 Comprobante detectado` - Se detectó imagen
- `✅ Pedido creado` - Pedido guardado en DB
- `✅ Mensaje enviado al cliente` - WhatsApp enviado

---

## 🐛 Troubleshooting

### Error: "Function not found"
- Verificar que la función esté desplegada
- Verificar el nombre de la función en la URL

### Error: "Unauthorized"
- Verificar que el header `apikey` esté presente
- Verificar que la key sea correcta

### Error: "Missing environment variables"
- Ir a Settings → Edge Functions → Secrets
- Verificar que todas las variables estén configuradas

### Pedido se crea pero no llega mensaje
- Verificar logs: buscar "Error al enviar mensaje"
- Verificar BUILDERBOT_API_URL y BUILDERBOT_API_KEY
- Verificar que el teléfono sea válido

---

## 📊 Diferencias entre Mayorista y Express

| Característica | Mayorista | Express |
|----------------|-----------|---------|
| Archivo | `edge-function-v2-builderbot.ts` | `edge-function-express-builderbot.ts` |
| Función | `crear-pedido-whatsapp` | `crear-pedido-express` |
| unidad_negocio | `datosExtraidos.unidad_negocio \|\| 'Mayorista'` | `'Express'` (hardcoded) |
| Mensaje | "Pedido Confirmado - Grupo Brico" | "Pedido Confirmado - Brico Express" |
| Link turno | `?unidad=Mayorista` | `?unidad=Express` |
| Notas internas | "...desde WhatsApp con OpenAI" | "...desde WhatsApp Express con OpenAI" |

---

## 🎯 Próximos Pasos

1. ✅ Desplegar ambas funciones a Supabase
2. ✅ Configurar variables de entorno
3. ✅ Probar ambos webhooks
4. ✅ Configurar en BuilderBot (2 flujos separados)
5. ✅ Probar flujo completo end-to-end
6. ✅ Verificar que los pedidos se crean en la sucursal correcta
