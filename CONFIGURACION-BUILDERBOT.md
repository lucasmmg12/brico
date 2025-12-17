# 🔧 Configuración de Variables de Entorno - BuilderBot

## 📋 Variables de Entorno Necesarias

### **Variables Compartidas (ambas funciones)**
```
OPENAI_API_KEY=sk-proj-...
SUPABASE_URL=https://fhfacchqwvzpkmxlleri.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Variables para MAYORISTA** (`crear-pedido-whatsapp`)
```
BUILDERBOT_API_URL=https://app.builderbot.cloud/api/v2/c13bbb6b-c2e5-4595-b5eb-7278b6139699/messages
BUILDERBOT_API_KEY=bb-ce91874a-ee62-40a3-8bc9-0d993145b081
```

### **Variables para EXPRESS** (`crear-pedido-express`)
```
BUILDERBOT_EXPRESS_API_URL=https://app.builderbot.cloud/api/v2/6cb13f38-d2e8-4f95-844c-92305f9b464e/messages
BUILDERBOT_EXPRESS_API_KEY=bb-cd66a218-334d-438c-a701-ffdb53566edd
```

---

## 🚀 Cómo Configurar en Supabase

### Opción 1: Desde Supabase Dashboard

1. **Ir a Supabase Dashboard**
   - URL: https://supabase.com/dashboard/project/fhfacchqwvzpkmxlleri

2. **Navegar a Edge Functions**
   - Menú lateral → **Edge Functions**

3. **Configurar Secrets**
   - Click en **Settings** → **Edge Functions** → **Secrets**
   - O directamente: **Edge Functions** → **Manage secrets**

4. **Agregar Variables**
   
   Click en **"Add secret"** para cada una:

   ```
   Name: OPENAI_API_KEY
   Value: sk-proj-...
   ```

   ```
   Name: BUILDERBOT_API_URL
   Value: https://app.builderbot.cloud/api/v2/c13bbb6b-c2e5-4595-b5eb-7278b6139699/messages
   ```

   ```
   Name: BUILDERBOT_API_KEY
   Value: bb-ce91874a-ee62-40a3-8bc9-0d993145b081
   ```

   ```
   Name: BUILDERBOT_EXPRESS_API_URL
   Value: https://app.builderbot.cloud/api/v2/6cb13f38-d2e8-4f95-844c-92305f9b464e/messages
   ```

   ```
   Name: BUILDERBOT_EXPRESS_API_KEY
   Value: bb-cd66a218-334d-438c-a701-ffdb53566edd
   ```

5. **Guardar**
   - Click en **"Save"** después de cada variable

---

### Opción 2: Con Supabase CLI

```bash
# Configurar variables compartidas
supabase secrets set OPENAI_API_KEY=sk-proj-...

# Configurar variables de Mayorista
supabase secrets set BUILDERBOT_API_URL=https://app.builderbot.cloud/api/v2/c13bbb6b-c2e5-4595-b5eb-7278b6139699/messages
supabase secrets set BUILDERBOT_API_KEY=bb-ce91874a-ee62-40a3-8bc9-0d993145b081

# Configurar variables de Express
supabase secrets set BUILDERBOT_EXPRESS_API_URL=https://app.builderbot.cloud/api/v2/6cb13f38-d2e8-4f95-844c-92305f9b464e/messages
supabase secrets set BUILDERBOT_EXPRESS_API_KEY=bb-cd66a218-334d-438c-a701-ffdb53566edd
```

---

## 🔍 Verificar Configuración

### Ver todas las variables configuradas:
```bash
supabase secrets list
```

### Verificar en logs:
Cuando despliegues las funciones, los logs mostrarán si las variables están configuradas:
- ✅ Si está configurada: La función funciona normalmente
- ❌ Si falta: Verás error "Missing environment variable"

---

## 📊 Diferencias entre Mayorista y Express

| Variable | Mayorista | Express |
|----------|-----------|---------|
| **API URL** | `BUILDERBOT_API_URL` | `BUILDERBOT_EXPRESS_API_URL` |
| **API Key** | `BUILDERBOT_API_KEY` | `BUILDERBOT_EXPRESS_API_KEY` |
| **Bot ID** | `c13bbb6b-c2e5-4595-b5eb-7278b6139699` | `6cb13f38-d2e8-4f95-844c-92305f9b464e` |
| **API Key Value** | `bb-ce91874a-ee62-40a3-8bc9-0d993145b081` | `bb-cd66a218-334d-438c-a701-ffdb53566edd` |

---

## 🎯 Cómo Funcionan las Variables

### **Edge Function Mayorista** (`edge-function-v2-builderbot.ts`):
```typescript
const BUILDERBOT_API_URL = Deno.env.get('BUILDERBOT_API_URL') || '';
const BUILDERBOT_API_KEY = Deno.env.get('BUILDERBOT_API_KEY') || '';
```

### **Edge Function Express** (`edge-function-express-builderbot.ts`):
```typescript
const BUILDERBOT_API_URL = Deno.env.get('BUILDERBOT_EXPRESS_API_URL') || 
    'https://app.builderbot.cloud/api/v2/6cb13f38-d2e8-4f95-844c-92305f9b464e/messages';
const BUILDERBOT_API_KEY = Deno.env.get('BUILDERBOT_EXPRESS_API_KEY') || 
    'bb-cd66a218-334d-438c-a701-ffdb53566edd';
```

**Nota**: La función Express tiene valores por defecto (fallback) en caso de que las variables no estén configuradas.

---

## ⚠️ Importante

1. **No commitear las API keys** al repositorio Git
2. **Configurar las variables ANTES de desplegar** las funciones
3. **Verificar en logs** que las funciones usan las credenciales correctas
4. **Cada sucursal** tiene su propio bot de BuilderBot con credenciales únicas

---

## 🧪 Probar Configuración

### Test Mayorista:
```bash
curl --location 'https://app.builderbot.cloud/api/v2/c13bbb6b-c2e5-4595-b5eb-7278b6139699/messages' \
--header 'Content-Type: application/json' \
--header 'x-api-builderbot: bb-ce91874a-ee62-40a3-8bc9-0d993145b081' \
--data '{
    "messages": {
        "content": "Test Mayorista"
    },
    "number": "5492645438114",
    "checkIfExists": false
}'
```

### Test Express:
```bash
curl --location 'https://app.builderbot.cloud/api/v2/6cb13f38-d2e8-4f95-844c-92305f9b464e/messages' \
--header 'Content-Type: application/json' \
--header 'x-api-builderbot: bb-cd66a218-334d-438c-a701-ffdb53566edd' \
--data '{
    "messages": {
        "content": "Test Express"
    },
    "number": "5492645438114",
    "checkIfExists": false
}'
```

Si ambos tests funcionan, las credenciales están correctas. ✅
