# 🔐 Configuración de Variables de Entorno - Supabase Edge Function

## ⚠️ IMPORTANTE: Seguridad

Las API Keys **NO deben estar en el código**. GitHub las detecta y bloquea el push.

Todas las credenciales deben configurarse como **variables de entorno** en Supabase Dashboard.

---

## 📋 Variables Requeridas

Ve a: https://supabase.com/dashboard/project/fhfacchqwvzpkmxlleri/settings/functions

En la sección **"Secrets"**, agrega las siguientes variables:

### 1️⃣ OPENAI_API_KEY
- Name: `OPENAI_API_KEY`
- Value: Tu API key de OpenAI (empieza con `sk-proj-...`)
- Obtén tu key en: https://platform.openai.com/api-keys

### 2️⃣ BUILDERBOT_API_URL
- Name: `BUILDERBOT_API_URL`
- Value: `https://app.builderbot.cloud/api/v2/c13bbb6b-c2e5-4595-b5eb-7278b6139699/messages`

### 3️⃣ BUILDERBOT_API_KEY
- Name: `BUILDERBOT_API_KEY`
- Value: Tu API key de BuilderBot (empieza con `bb-...`)
- Obtén tu key en: BuilderBot Dashboard → Settings → API Keys

---

## ✅ Pasos para Configurar

1. **Ir a Supabase Dashboard**:
   https://supabase.com/dashboard/project/fhfacchqwvzpkmxlleri/settings/functions

2. **Scroll hasta "Secrets"**

3. **Click en "Add new secret"**

4. **Agregar cada variable** (ver arriba)

5. **Redesplegar la Edge Function** para que tome las nuevas variables

---

## 🔄 Redesplegar Edge Function

Después de configurar las variables:

1. Ve a: https://supabase.com/dashboard/project/fhfacchqwvzpkmxlleri/functions/crear-pedido-whatsapp

2. Click en "Deploy"

3. O actualiza el código desde el Dashboard

---

## ✅ Verificar Configuración

Prueba el webhook con:

```powershell
powershell -ExecutionPolicy Bypass -File test-webhook-simple.ps1
```

Si funciona correctamente, verás:
- ✅ Pedido creado
- ✅ Datos extraídos por OpenAI
- ✅ Link de turno generado

---

## 🔒 Seguridad

- ✅ Las API keys están en variables de entorno
- ✅ No están en el código fuente
- ✅ GitHub no las detectará
- ✅ Más seguro y profesional

---

**Nota**: Las credenciales reales están guardadas localmente en un archivo que NO se sube a GitHub.
