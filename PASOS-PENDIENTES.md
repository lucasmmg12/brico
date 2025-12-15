# ✅ Pasos Pendientes para Completar la Configuración

## ✅ YA COMPLETADO:
- [x] Credenciales configuradas en `config.js`
  - URL: `https://fhfacchqwvzpkmxlleri.supabase.co`
  - Anon Key: Configurada ✓

---

## 📝 PASOS QUE DEBES COMPLETAR:

### 1️⃣ Ejecutar el Script SQL

**¿Dónde?** Supabase Dashboard → SQL Editor

**¿Cómo?**
1. Inicia sesión en Supabase: https://supabase.com/dashboard/sign-in
2. Ve a tu proyecto: https://supabase.com/dashboard/project/fhfacchqwvzpkmxlleri
3. En el menú lateral, haz clic en **"SQL Editor"**
4. Haz clic en **"New query"**
5. Copia TODO el contenido del archivo `supabase-setup.sql`
6. Pégalo en el editor
7. Haz clic en **"Run"** (botón verde en la esquina inferior derecha)
8. ✅ Deberías ver: "Success. No rows returned"

**¿Qué hace este script?**
- Crea la tabla `pedidos` con todos los campos necesarios
- Configura índices para optimizar las consultas
- Habilita Row Level Security (RLS)
- Crea políticas de acceso público (para desarrollo)
- Inserta 5 pedidos de prueba
- Crea una función para obtener estadísticas

---

### 2️⃣ Crear el Bucket de Storage

**¿Dónde?** Supabase Dashboard → Storage

**¿Cómo?**
1. En el menú lateral, haz clic en **"Storage"**
2. Haz clic en **"Create a new bucket"**
3. Completa:
   - **Name**: `comprobantes`
   - **Public bucket**: ✅ **MARCAR ESTE CHECKBOX** (muy importante)
4. Haz clic en **"Create bucket"**

**¿Por qué público?**
Para que las imágenes de los comprobantes se puedan ver directamente desde el navegador sin autenticación.

---

### 3️⃣ Configurar Políticas de Storage

**¿Dónde?** Storage → comprobantes → Policies

**¿Cómo?**
1. Haz clic en el bucket `comprobantes`
2. Ve a la pestaña **"Policies"**
3. Haz clic en **"New policy"**
4. Selecciona **"For full customization"**

**Política 1 - Lectura Pública:**
```
Policy name: Public read access
Allowed operation: SELECT
Target roles: public
Policy definition: true
```

**Política 2 - Subida Pública:**
```
Policy name: Public upload access
Allowed operation: INSERT
Target roles: public
Policy definition: true
```

---

## 🧪 Verificar que Todo Funciona

### Opción A: Servidor Local (Recomendado)

```bash
# En la carpeta del proyecto, ejecuta:
python -m http.server 8000
```

Luego abre: http://localhost:8000

### Opción B: Abrir Directamente

Abre el archivo `index.html` en tu navegador (puede dar problemas de CORS)

---

## ✅ Checklist de Verificación

Cuando abras el dashboard, deberías ver:

- [ ] Los 5 pedidos de prueba se cargan automáticamente
- [ ] Las estadísticas muestran: "5 pedidos" y el monto total
- [ ] Puedes cambiar entre "Mayorista" y "Express"
- [ ] Puedes crear un nuevo pedido
- [ ] Puedes cambiar el estado de pago (Pendiente/Pagado/Rechazado)
- [ ] Puedes cambiar el estado del pedido (Nuevo/Armado/Entregado/No vino)
- [ ] Puedes subir un comprobante (imagen)
- [ ] Puedes ver el comprobante haciendo clic en "Ver"

---

## 🐛 Si algo no funciona:

### No se cargan los pedidos
1. Abre la consola del navegador (F12)
2. Busca errores en rojo
3. Verifica que ejecutaste el script SQL correctamente
4. Ve a Supabase → Table Editor → Deberías ver la tabla `pedidos`

### Error de CORS
- No uses `file://` directamente
- Usa un servidor local: `python -m http.server 8000`

### No se pueden subir comprobantes
- Verifica que el bucket `comprobantes` exista
- Verifica que sea **público**
- Verifica que las políticas estén configuradas

---

## 📞 Siguiente Paso

Una vez que completes estos 3 pasos:
1. ✅ Ejecutar script SQL
2. ✅ Crear bucket de Storage
3. ✅ Configurar políticas

**Abre el dashboard y prueba que todo funcione.**

Si tienes algún problema, avísame y te ayudo a resolverlo! 🚀
