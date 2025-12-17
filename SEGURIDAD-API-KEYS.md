# 🔐 Acción Urgente: Revocar API Key de OpenAI

## ⚠️ IMPORTANTE: API Key Expuesta

La API key de OpenAI fue detectada por GitHub en commits anteriores. Aunque ya eliminamos el historial, **debes revocar la key inmediatamente** para evitar uso no autorizado.

---

## 📋 Pasos para Revocar la API Key

### 1. **Ir a OpenAI Dashboard**
   - Abre: https://platform.openai.com/api-keys
   - Inicia sesión con tu cuenta

### 2. **Encontrar la API Key Expuesta**
   - Busca la key que empieza con: `sk-proj-...`
   - Es la que estaba en `supabase/functions/crear-pedido-whatsapp/index.ts`

### 3. **Revocar la Key**
   - Haz clic en el ícono de **tres puntos** (...) al lado de la key
   - Selecciona **"Revoke"** o **"Delete"**
   - Confirma la acción

### 4. **Crear una Nueva API Key**
   - Haz clic en **"Create new secret key"**
   - Dale un nombre descriptivo: `Brico - Edge Function - Production`
   - Copia la nueva key (solo se muestra una vez)

---

## 🔧 Configurar la Nueva API Key

### En Supabase (para Edge Functions)

1. **Ir a Supabase Dashboard**
   - Abre: https://supabase.com/dashboard
   - Selecciona tu proyecto

2. **Configurar Variable de Entorno**
   - Ve a **Settings** → **Edge Functions** → **Secrets**
   - Busca `OPENAI_API_KEY`
   - Haz clic en **Edit**
   - Pega la nueva API key
   - Guarda los cambios

3. **Redesplegar la Edge Function**
   ```bash
   # Desde la terminal
   cd c:\Users\lucas\Desktop\Proyectos\brico
   
   # Redesplegar la función
   supabase functions deploy crear-pedido-whatsapp
   ```

### En Vercel (si usas la Edge Function allí)

1. **Ir a Vercel Dashboard**
   - Abre: https://vercel.com/dashboard
   - Selecciona tu proyecto `brico`

2. **Actualizar Variable de Entorno**
   - Ve a **Settings** → **Environment Variables**
   - Busca `OPENAI_API_KEY`
   - Haz clic en **Edit**
   - Pega la nueva API key
   - Guarda y **Redeploy**

---

## ✅ Verificar que Funciona

Después de actualizar la key:

1. **Probar la Edge Function**
   - Envía un mensaje de prueba desde WhatsApp
   - Verifica que se cree el pedido correctamente

2. **Revisar los Logs**
   - En Supabase: **Edge Functions** → **Logs**
   - No deberías ver errores de autenticación

---

## 🛡️ Mejores Prácticas para el Futuro

### ✅ NUNCA hagas esto:
```typescript
// ❌ MAL - API key hardcodeada
const OPENAI_API_KEY = 'sk-proj-abc123...';
```

### ✅ SIEMPRE haz esto:
```typescript
// ✅ BIEN - Usar variable de entorno
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || '';
```

### Archivos que NUNCA deben ir a Git:
- `.env`
- `.env.local`
- `.env.production`
- Cualquier archivo con `API_KEY`, `SECRET`, `TOKEN` en el nombre

### Verificar antes de hacer commit:
```bash
# Ver qué archivos vas a commitear
git status

# Ver el contenido exacto que vas a commitear
git diff --cached

# Si ves una API key, NO hagas commit
# Primero muévela a .env y usa variables de entorno
```

---

## 📞 Soporte

Si tienes problemas:
1. Verifica que la nueva API key esté configurada en Supabase
2. Revisa los logs de la Edge Function
3. Asegúrate de haber redespliegado después de cambiar la key

---

**¡Revoca la API key expuesta AHORA para evitar cargos no autorizados!** 🚨
