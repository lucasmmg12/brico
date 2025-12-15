# 🛒 Dashboard Administrativo - Grupo Brico

Sistema de gestión de pedidos para supermercado con dos unidades de negocio: **Mayorista** y **Express**.

## 🎨 Características

- ✅ **UI Minimalista** con alto contraste
- 🎨 **Paleta de colores corporativa**: Naranja (#FF6700) y Verde Brico (#28B463)
- 📱 **Responsive Design** - Funciona en móviles, tablets y desktop
- ⚡ **Tiempo Real** - Actualizaciones instantáneas con Supabase
- 🔐 **Seguro** - Row Level Security (RLS) configurado
- 🎯 **Filtros Inteligentes** - Por estado de pago y pedido
- 📊 **Estadísticas en Vivo** - Total de pedidos y montos

## 🚀 Instalación Rápida

### Paso 1: Configurar Supabase

1. **Crea un proyecto en Supabase**
   - Ve a [https://supabase.com](https://supabase.com)
   - Crea una cuenta gratuita
   - Crea un nuevo proyecto

2. **Ejecuta el script SQL**
   - Abre el archivo `supabase-setup.sql`
   - Copia todo el contenido
   - Ve a tu proyecto Supabase > **SQL Editor**
   - Pega el script y haz click en **Run**

3. **Configura Storage**
   - Ve a **Storage** en Supabase
   - Crea un nuevo bucket llamado `comprobantes`
   - Configúralo como **público**

4. **Obtén tus credenciales**
   - Ve a **Settings** > **API**
   - Copia la **Project URL**
   - Copia la **anon public** key

### Paso 2: Configurar el Frontend

1. **Edita el archivo `config.js`**
   ```javascript
   const SUPABASE_CONFIG = {
       url: 'https://tu-proyecto.supabase.co',  // Pega tu URL aquí
       anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',  // Pega tu key aquí
       storageBucket: 'comprobantes'
   };
   ```

2. **Abre el dashboard**
   - Simplemente abre `index.html` en tu navegador
   - O usa un servidor local:
     ```bash
     # Con Python
     python -m http.server 8000
     
     # Con Node.js
     npx http-server
     ```

## 📁 Estructura del Proyecto

```
brico/
├── index.html              # Página principal
├── styles.css              # Estilos minimalistas
├── app.js                  # Lógica de la aplicación
├── config.js               # Configuración de Supabase
├── supabase-setup.sql      # Script de base de datos
└── README.md               # Este archivo
```

## 🎯 Funcionalidades

### Header
- **Logo Brico** con degradado naranja
- **Tabs** para cambiar entre Mayorista y Express
- **Estadísticas rápidas**: Total de pedidos y monto acumulado

### Gestión de Pedidos
- ✅ **Crear** nuevos pedidos
- 👁️ **Ver** comprobantes en modal
- ✏️ **Actualizar** estados de pago y pedido
- 🎯 **Filtrar** por estado
- 🔄 **Actualización automática**

### Estados de Pago
- 🟡 **Pendiente** (amarillo)
- 🟢 **Pagado** (verde - borde destacado)
- 🔴 **Rechazado** (rojo)

### Estados de Pedido
- 🆕 **Nuevo**
- ✅ **Armado** (listo para entregar)
- 📦 **Entregado**
- ❌ **No vino**

## 🎨 Paleta de Colores

```css
--color-primary: #FF6700;      /* Naranja Intenso - Headers y botones principales */
--color-secondary: #28B463;    /* Verde Brico - Éxito y confirmación */
--color-background: #F4F6F6;   /* Gris claro - Fondo general */
```

## 📊 Base de Datos

### Tabla: `pedidos`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | uuid | ID único (auto-generado) |
| `created_at` | timestamptz | Fecha de creación |
| `cliente_nombre` | text | Nombre y apellido |
| `cliente_dni` | text | DNI del cliente |
| `unidad_negocio` | text | 'Mayorista' o 'Express' |
| `promo_seleccionada` | text | Nombre de la promo |
| `monto` | numeric | Monto en pesos |
| `comprobante_url` | text | URL del comprobante |
| `estado_pago` | text | pendiente/pagado/rechazado |
| `estado_pedido` | text | nuevo/armado/entregado/no_vino |
| `notas_internas` | text | Observaciones |

## 🔧 Personalización

### Cambiar colores
Edita las variables CSS en `styles.css`:
```css
:root {
    --color-primary: #FF6700;    /* Tu color primario */
    --color-secondary: #28B463;  /* Tu color secundario */
}
```

### Agregar nuevas promos
Las promos son texto libre, pero puedes crear un selector en el formulario editando `index.html`.

### Habilitar actualizaciones en tiempo real
Descomenta el código al final de `app.js`:
```javascript
supabaseClient
    .channel('pedidos-changes')
    .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'pedidos' },
        (payload) => {
            cargarPedidos();
        }
    )
    .subscribe();
```

## 🔐 Seguridad

### Para Desarrollo
El script SQL incluye políticas RLS que permiten acceso público. **Esto es solo para desarrollo rápido.**

### Para Producción
Deberías:
1. Implementar autenticación de usuarios
2. Actualizar las políticas RLS para restringir acceso
3. Validar datos en el backend
4. Usar HTTPS

Ejemplo de política RLS con autenticación:
```sql
CREATE POLICY "Solo usuarios autenticados pueden leer"
ON pedidos FOR SELECT
USING (auth.role() = 'authenticated');
```

## 📱 Responsive Design

El dashboard está optimizado para:
- 📱 **Móviles**: 320px - 767px
- 📱 **Tablets**: 768px - 1023px
- 💻 **Desktop**: 1024px+

## 🐛 Solución de Problemas

### No se cargan los pedidos
1. Verifica que las credenciales en `config.js` sean correctas
2. Abre la consola del navegador (F12) y busca errores
3. Verifica que el script SQL se haya ejecutado correctamente

### Error de CORS
Si usas `file://`, algunos navegadores bloquean las peticiones. Usa un servidor local:
```bash
python -m http.server 8000
```

### No se ven las imágenes de comprobantes
1. Verifica que el bucket `comprobantes` exista en Supabase Storage
2. Asegúrate de que sea público
3. Verifica que las URLs sean válidas

## 📈 Próximas Mejoras

- [ ] Sistema de autenticación
- [ ] Exportar reportes a Excel/PDF
- [ ] Gráficos de estadísticas
- [ ] Notificaciones push
- [ ] Búsqueda por nombre/DNI
- [ ] Historial de cambios
- [ ] Impresión de pedidos

## 🤝 Soporte

Para problemas o preguntas:
1. Revisa la consola del navegador (F12)
2. Verifica los logs de Supabase
3. Consulta la [documentación de Supabase](https://supabase.com/docs)

## 📄 Licencia

Este proyecto es de uso interno para Grupo Brico.

---

**Desarrollado con ❤️ para Grupo Brico**
