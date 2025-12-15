# 🚀 Guía Completa: Subir Brico a Supabase

## Paso 1: Crear tu Proyecto en Supabase

### 1.1 Acceder a Supabase
1. Ve a [https://supabase.com/dashboard/sign-in](https://supabase.com/dashboard/sign-in)
2. Inicia sesión con tu cuenta (GitHub, Google, o email)
3. Si no tienes cuenta, crea una nueva (es gratis)

### 1.2 Crear un Nuevo Proyecto
1. Una vez dentro, haz clic en **"New Project"** (Nuevo Proyecto)
2. Completa los datos:
   - **Name**: `brico-dashboard` (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña segura (¡guárdala!)
   - **Region**: Selecciona la más cercana (ej: `South America (São Paulo)`)
   - **Pricing Plan**: Selecciona **Free** (gratis)
3. Haz clic en **"Create new project"**
4. ⏳ Espera 2-3 minutos mientras Supabase crea tu proyecto

---

## Paso 2: Configurar la Base de Datos

### 2.1 Abrir el SQL Editor
1. En el menú lateral izquierdo, busca y haz clic en **"SQL Editor"**
2. Haz clic en **"New query"** (Nueva consulta)

### 2.2 Ejecutar el Script de Configuración
1. Abre el archivo `supabase-setup.sql` de tu proyecto
2. **Copia TODO el contenido** del archivo
3. **Pega** el contenido en el editor SQL de Supabase
4. Haz clic en el botón **"Run"** (Ejecutar) en la esquina inferior derecha
5. ✅ Deberías ver un mensaje de éxito: "Success. No rows returned"

### 2.3 Verificar que se Creó la Tabla
1. En el menú lateral, haz clic en **"Table Editor"**
2. Deberías ver la tabla **"pedidos"** con 5 registros de prueba
3. Si ves la tabla y los datos, ¡perfecto! ✅

---

## Paso 3: Configurar Storage para Comprobantes

### 3.1 Crear el Bucket
1. En el menú lateral, haz clic en **"Storage"**
2. Haz clic en **"Create a new bucket"** (Crear nuevo bucket)
3. Completa los datos:
   - **Name**: `comprobantes`
   - **Public bucket**: ✅ **Activar** (marcar el checkbox)
4. Haz clic en **"Create bucket"**

### 3.2 Configurar Políticas de Acceso
1. Haz clic en el bucket `comprobantes` que acabas de crear
2. Ve a la pestaña **"Policies"** (Políticas)
3. Haz clic en **"New policy"**
4. Selecciona **"For full customization"** (Para personalización completa)
5. Crea una política para **SELECT** (lectura):
   ```
   Policy name: Public read access
   Allowed operation: SELECT
   Policy definition: true
   ```
6. Crea otra política para **INSERT** (subida):
   ```
   Policy name: Public upload access
   Allowed operation: INSERT
   Policy definition: true
   ```

---

## Paso 4: Obtener las Credenciales

### 4.1 Ir a la Configuración de API
1. En el menú lateral, haz clic en el ícono de **⚙️ Settings** (Configuración)
2. Selecciona **"API"** en el submenú

### 4.2 Copiar las Credenciales
Verás dos valores importantes:

#### 📍 Project URL
```
https://[tu-proyecto-id].supabase.co
```
**Ejemplo**: `https://abcdefghijklmnop.supabase.co`

#### 🔑 API Key (anon/public)
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```
(Es una clave muy larga, asegúrate de copiarla completa)

---

## Paso 5: Configurar el Frontend

### 5.1 Editar config.js
1. Abre el archivo `config.js` en tu proyecto
2. Reemplaza los valores con tus credenciales:

```javascript
const SUPABASE_CONFIG = {
    // Pega aquí tu Project URL
    url: 'https://tu-proyecto-id.supabase.co',
    
    // Pega aquí tu anon/public key
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    
    // Esto no lo cambies
    storageBucket: 'comprobantes'
};
```

3. **Guarda el archivo** (Ctrl + S)

---

## Paso 6: Probar la Aplicación

### 6.1 Abrir el Dashboard
1. Abre el archivo `index.html` en tu navegador
2. O usa un servidor local:
   ```bash
   # Con Python
   python -m http.server 8000
   
   # Con Node.js
   npx http-server
   ```

### 6.2 Verificar que Funciona
✅ Deberías ver:
- Los 5 pedidos de prueba cargados
- Estadísticas mostrando el total de pedidos y monto
- Poder cambiar entre "Mayorista" y "Express"

### 6.3 Probar Funcionalidades
1. **Crear un pedido nuevo**: Haz clic en "Nuevo Pedido"
2. **Actualizar estado**: Cambia el estado de pago o pedido
3. **Ver comprobante**: Si subes un comprobante, deberías poder verlo

---

## 🐛 Solución de Problemas

### ❌ No se cargan los pedidos
**Problema**: La tabla está vacía o no se conecta

**Solución**:
1. Abre la consola del navegador (F12)
2. Busca errores en rojo
3. Verifica que las credenciales en `config.js` sean correctas
4. Verifica que el script SQL se haya ejecutado correctamente

### ❌ Error de CORS
**Problema**: `Access to fetch has been blocked by CORS policy`

**Solución**:
- No uses `file://` directamente
- Usa un servidor local:
  ```bash
  python -m http.server 8000
  ```
- Luego abre: `http://localhost:8000`

### ❌ No se pueden subir comprobantes
**Problema**: Error al subir archivos

**Solución**:
1. Verifica que el bucket `comprobantes` exista
2. Verifica que sea **público**
3. Verifica que las políticas de acceso estén configuradas

### ❌ Las imágenes no se ven
**Problema**: Los comprobantes no se muestran

**Solución**:
1. Verifica que el bucket sea público
2. Abre la URL del comprobante directamente en el navegador
3. Si da error 404, el archivo no se subió correctamente

---

## 📊 Verificar en Supabase

### Ver los Datos en Tiempo Real
1. Ve a **Table Editor** en Supabase
2. Selecciona la tabla `pedidos`
3. Cada vez que crees/edites un pedido en el dashboard, deberías verlo aquí

### Ver los Comprobantes Subidos
1. Ve a **Storage** en Supabase
2. Haz clic en el bucket `comprobantes`
3. Deberías ver todos los archivos subidos

---

## 🎯 Próximos Pasos (Opcional)

### Habilitar Actualizaciones en Tiempo Real
Si quieres que el dashboard se actualice automáticamente cuando otro usuario haga cambios:

1. Abre `app.js`
2. Busca el comentario `// Actualizaciones en tiempo real`
3. Descomenta ese código

### Agregar Autenticación
Para producción, deberías agregar autenticación:

1. Ve a **Authentication** en Supabase
2. Configura proveedores (Email, Google, etc.)
3. Actualiza las políticas RLS para requerir autenticación

---

## ✅ Checklist Final

Antes de considerar que todo está listo, verifica:

- [ ] Proyecto creado en Supabase
- [ ] Script SQL ejecutado correctamente
- [ ] Tabla `pedidos` visible con 5 registros de prueba
- [ ] Bucket `comprobantes` creado y público
- [ ] Políticas de Storage configuradas
- [ ] Credenciales copiadas a `config.js`
- [ ] Dashboard abre correctamente
- [ ] Se ven los pedidos de prueba
- [ ] Puedes crear un nuevo pedido
- [ ] Puedes actualizar estados
- [ ] Puedes subir y ver comprobantes

---

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12)
2. Revisa los logs en Supabase (menú **Logs**)
3. Consulta la [documentación oficial de Supabase](https://supabase.com/docs)

---

**¡Listo! Tu dashboard Brico ahora está en la nube con Supabase** 🚀
