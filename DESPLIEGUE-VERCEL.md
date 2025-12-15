# 🚀 Guía de Despliegue en Vercel

## ✅ Archivos Creados

- ✅ `.env` - Variables de entorno locales
- ✅ `.env.example` - Plantilla de ejemplo
- ✅ `vercel.json` - Configuración de Vercel
- ✅ `.gitignore` - Archivos a ignorar en Git

---

## 📋 Configurar Variables de Entorno en Vercel

### Opción 1: Desde el Dashboard de Vercel (Recomendado)

1. **Ir a tu proyecto en Vercel**
   - Ve a: https://vercel.com/dashboard
   - Selecciona tu proyecto `brico`

2. **Abrir Configuración**
   - Haz clic en **Settings** (Configuración)
   - En el menú lateral, selecciona **Environment Variables**

3. **Agregar las Variables**
   
   Agrega estas 3 variables una por una:

   **Variable 1:**
   ```
   Name: VITE_SUPABASE_URL
   Value: https://fhfacchqwvzpkmxlleri.supabase.co
   Environment: Production, Preview, Development (selecciona todas)
   ```

   **Variable 2:**
   ```
   Name: VITE_SUPABASE_ANON_KEY
   Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoZmFjY2hxd3Z6cGtteGxsZXJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4Mjk4MjEsImV4cCI6MjA4MTQwNTgyMX0.6gDuw58ShxvJ39f_t7Wl9PWAZWCrwHR-ogPs3MTURxU
   Environment: Production, Preview, Development (selecciona todas)
   ```

   **Variable 3:**
   ```
   Name: VITE_SUPABASE_STORAGE_BUCKET
   Value: comprobantes
   Environment: Production, Preview, Development (selecciona todas)
   ```

4. **Guardar y Redesplegar**
   - Haz clic en **Save** para cada variable
   - Ve a la pestaña **Deployments**
   - En el último deployment, haz clic en los tres puntos `...`
   - Selecciona **Redeploy**
   - Marca la opción **"Use existing Build Cache"** (opcional)
   - Haz clic en **Redeploy**

---

### Opción 2: Desde la CLI de Vercel

Si tienes Vercel CLI instalado:

```bash
# Instalar Vercel CLI (si no lo tienes)
npm i -g vercel

# Ir a la carpeta del proyecto
cd c:/Users/lucas/Desktop/Proyectos/brico

# Configurar variables de entorno
vercel env add VITE_SUPABASE_URL production
# Pega: https://fhfacchqwvzpkmxlleri.supabase.co

vercel env add VITE_SUPABASE_ANON_KEY production
# Pega: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZoZmFjY2hxd3Z6cGtteGxsZXJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4Mjk4MjEsImV4cCI6MjA4MTQwNTgyMX0.6gDuw58ShxvJ39f_t7Wl9PWAZWCrwHR-ogPs3MTURxU

vercel env add VITE_SUPABASE_STORAGE_BUCKET production
# Pega: comprobantes

# Redesplegar
vercel --prod
```

---

## 🔧 Actualizar el Repositorio

Si ya subiste el código a GitHub/GitLab, necesitas actualizar:

```bash
# Agregar los nuevos archivos
git add .env.example .gitignore vercel.json

# NO agregues .env (ya está en .gitignore)
# Hacer commit
git commit -m "Add Vercel configuration and environment variables"

# Subir cambios
git push origin main
```

**IMPORTANTE:** El archivo `.env` NO debe subirse a Git (ya está en `.gitignore`)

---

## 🐛 Solución de Problemas

### ❌ El sitio está en blanco

**Posibles causas:**

1. **Las variables de entorno no están configuradas**
   - Verifica en Vercel → Settings → Environment Variables
   - Deben estar las 3 variables configuradas

2. **El archivo config.js no carga las variables**
   - Verifica que `config.js` esté usando las variables correctamente
   - Abre la consola del navegador (F12) y busca errores

3. **Error de CORS o Supabase**
   - Verifica que las credenciales sean correctas
   - Prueba las credenciales localmente primero

### ❌ Error 404 en rutas

Si tienes problemas con las rutas, verifica que `vercel.json` esté configurado correctamente.

### ❌ Las variables no se aplican

Después de agregar variables de entorno, SIEMPRE debes redesplegar:
1. Ve a Deployments
2. Redeploy el último deployment

---

## ✅ Verificar que Funciona

Una vez desplegado:

1. **Abre tu sitio en Vercel**
   - URL: `https://tu-proyecto.vercel.app`

2. **Abre la consola del navegador** (F12)
   - No deberías ver errores de conexión a Supabase

3. **Verifica que se cargan los pedidos**
   - Deberías ver los 5 pedidos de prueba

4. **Prueba crear un pedido nuevo**
   - Si funciona, ¡todo está configurado correctamente! ✅

---

## 📊 Monitoreo

Para ver los logs en tiempo real:

1. Ve a tu proyecto en Vercel
2. Haz clic en **Deployments**
3. Selecciona el deployment activo
4. Haz clic en **View Function Logs** (si usas funciones)
5. O simplemente abre la consola del navegador en tu sitio desplegado

---

## 🎯 Próximos Pasos

Una vez que el sitio funcione en Vercel:

- [ ] Configura un dominio personalizado (opcional)
- [ ] Habilita HTTPS (Vercel lo hace automáticamente)
- [ ] Configura notificaciones de deployment
- [ ] Agrega protección con contraseña (si es necesario)

---

## 📞 Soporte

Si el sitio sigue sin funcionar:
1. Revisa los logs en Vercel
2. Abre la consola del navegador (F12)
3. Verifica que las variables de entorno estén configuradas
4. Prueba el sitio localmente primero

---

**¡Tu dashboard Brico ahora debería estar funcionando en Vercel!** 🚀
