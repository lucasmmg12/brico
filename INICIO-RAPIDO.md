# 🚀 Inicio Rápido - Dashboard Brico

## 🎭 Para Ver la DEMO (Sin Configuración)

**¡La forma más rápida de ver el dashboard funcionando!**

1. Abre el archivo: **`demo.html`**
2. ¡Listo! Ya puedes explorar todas las funcionalidades

### ¿Qué puedes hacer en la demo?
- ✅ Ver 10 pedidos de ejemplo (5 Mayorista + 5 Express)
- ✅ Cambiar entre unidades de negocio con los tabs
- ✅ Ver comprobantes en modal
- ✅ Cambiar estados de pago y pedido
- ✅ Marcar pedidos como listos
- ✅ Crear nuevos pedidos
- ✅ Filtrar por estado
- ✅ Ver notificaciones toast

---

## 🔧 Para Usar con Supabase (Producción)

### Paso 1: Configurar Supabase

1. **Crea un proyecto en Supabase**
   - Ve a [https://supabase.com](https://supabase.com)
   - Crea una cuenta gratuita
   - Crea un nuevo proyecto

2. **Ejecuta el script SQL**
   - Abre `supabase-setup.sql`
   - Copia todo el contenido
   - Ve a Supabase > **SQL Editor**
   - Pega y ejecuta (**Run**)

3. **Configura Storage**
   - Ve a **Storage** en Supabase
   - Crea un bucket: `comprobantes`
   - Hazlo **público**

### Paso 2: Configurar Credenciales

1. En Supabase, ve a **Settings** > **API**
2. Copia:
   - **Project URL**
   - **anon public key**

3. Edita `config.js`:
```javascript
const SUPABASE_CONFIG = {
    url: 'TU_URL_AQUI',      // ← Pega tu URL
    anonKey: 'TU_KEY_AQUI',  // ← Pega tu key
    storageBucket: 'comprobantes'
};
```

### Paso 3: Abrir el Dashboard

Abre **`index.html`** en tu navegador.

---

## 📁 Estructura de Archivos

```
brico/
├── 🎭 DEMO (Sin configuración)
│   ├── demo.html          ← ABRE ESTE para ver la demo
│   ├── app-demo.js        ← Datos mock
│   └── DEMO.md            ← Documentación de la demo
│
├── 🔧 PRODUCCIÓN (Con Supabase)
│   ├── index.html         ← Dashboard real
│   ├── app.js             ← Lógica con Supabase
│   ├── config.js          ← Configura tus credenciales aquí
│   └── supabase-setup.sql ← Ejecuta esto en Supabase
│
├── 🎨 ESTILOS
│   └── styles.css         ← Todos los estilos
│
└── 📚 DOCUMENTACIÓN
    └── README.md          ← Guía completa
```

---

## 🎯 Archivos Importantes

| Archivo | Descripción | ¿Cuándo usar? |
|---------|-------------|---------------|
| **demo.html** | Dashboard con datos de ejemplo | Para probar sin configurar nada |
| **index.html** | Dashboard con Supabase | Para producción con datos reales |
| **config.js** | Credenciales de Supabase | Edita antes de usar index.html |
| **supabase-setup.sql** | Script de base de datos | Ejecuta en Supabase SQL Editor |
| **styles.css** | Estilos del dashboard | Personaliza colores aquí |

---

## ⚡ Comandos Útiles

### Servidor Local (Opcional)

Si prefieres usar un servidor local:

```bash
# Con Python
python -m http.server 8000

# Con Node.js
npx http-server

# Con PHP
php -S localhost:8000
```

Luego abre: `http://localhost:8000/demo.html`

---

## 🎨 Personalización Rápida

### Cambiar Colores

Edita `styles.css` líneas 10-12:

```css
:root {
    --color-primary: #FF6700;    /* Naranja - Cambia aquí */
    --color-secondary: #28B463;  /* Verde - Cambia aquí */
    --color-background: #F4F6F6; /* Fondo - Cambia aquí */
}
```

### Agregar Promos Predefinidas

Edita el formulario en `index.html` o `demo.html`, reemplaza el input de promo por un select:

```html
<select id="input-promo" required>
    <option value="">Selecciona una promo...</option>
    <option value="Promo 1 - Almacén Completo">Promo 1 - Almacén</option>
    <option value="Promo 2 - Bebidas y Snacks">Promo 2 - Bebidas</option>
    <option value="Promo 3 - Limpieza">Promo 3 - Limpieza</option>
    <!-- Agrega más aquí -->
</select>
```

---

## 🐛 Solución de Problemas

### No se cargan los pedidos en index.html
- ✅ Verifica que configuraste `config.js` correctamente
- ✅ Abre la consola (F12) y busca errores
- ✅ Verifica que ejecutaste el SQL en Supabase

### Error de CORS
- ✅ Usa un servidor local (ver comandos arriba)
- ✅ No uses `file://` directamente

### Las imágenes no se ven
- ✅ Verifica que el bucket `comprobantes` existe
- ✅ Asegúrate de que sea público
- ✅ Verifica las URLs de las imágenes

---

## 📞 Ayuda

1. **Lee** `README.md` para la guía completa
2. **Lee** `DEMO.md` para ver todas las funcionalidades
3. **Revisa** la consola del navegador (F12) para errores
4. **Consulta** la [documentación de Supabase](https://supabase.com/docs)

---

## ✨ Características Destacadas

- 🎨 **UI Minimalista** de alto contraste
- 🟠 **Naranja (#FF6700)** para marca y acciones principales
- 🟢 **Verde (#28B463)** para éxito y confirmación
- 📱 **Responsive** - funciona en móvil, tablet y desktop
- ⚡ **Rápido** - optimizado para rendimiento
- 🔐 **Seguro** - RLS configurado en Supabase
- 🎯 **Intuitivo** - fácil de usar sin capacitación

---

**¡Disfruta tu Dashboard Brico!** 🛒✨

Para más información, consulta `README.md`
