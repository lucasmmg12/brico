# 📱 Sistema de Selección de Turnos para Clientes

## 🎯 Descripción

Sistema público para que los clientes seleccionen su turno de retiro desde WhatsApp.

---

## 🚀 Configuración

### 1️⃣ Agregar API Key de BuilderBot

Edita `seleccionar-turno.js` línea 9:

```javascript
const BUILDERBOT_CONFIG = {
    API_URL: 'https://app.builderbot.cloud/api/v2/c13bbb6b-c2e5-4595-b5eb-7278b6139699/messages',
    API_KEY: 'TU_API_KEY_AQUI' // ← Completar
};
```

### 2️⃣ Obtener la API Key

1. Ve a BuilderBot Dashboard
2. Settings → API Keys
3. Copia la API Key
4. Pégala en el archivo

---

## 📋 Flujo Completo

### Desde BuilderBot:

```javascript
// En tu flujo de BuilderBot, después de crear el pedido:

const flujoCrearPedido = addKeyword(['pedido', 'comprar'])
  // ... recopilar datos del cliente ...
  .addAnswer('✅ ¡Pedido confirmado!', null, async (ctx, { flowDynamic }) => {
    
    // Generar link de selección de turno
    const unidad = 'Mayorista'; // o 'Express'
    const link = `https://tu-proyecto.vercel.app/seleccionar-turno.html?unidad=${unidad}`;
    
    await flowDynamic([
      '📅 *Ahora elegí tu turno de retiro*',
      '',
      `👉 ${link}`,
      '',
      '⏰ Los turnos están disponibles desde +4 horas',
      '🆔 Recordá traer tu DNI al retirar'
    ].join('\n'));
  });
```

---

## 🎨 Características

### Paso 1: Formulario de Datos
- ✅ Nombre completo
- ✅ Teléfono (con código de área)
- ✅ Validación de campos

### Paso 2: Selección de Turno
- ✅ Calendario visual de próximos 7 días
- ✅ Solo muestra turnos disponibles (+4 horas)
- ✅ Turnos ocupados no se muestran
- ✅ Click para seleccionar

### Paso 3: Confirmación
- ✅ Guarda en Supabase
- ✅ Envía WhatsApp de confirmación
- ✅ Muestra mensaje de éxito

---

## 📱 Mensaje de Confirmación

El cliente recibe por WhatsApp:

```
✅ *Turno Confirmado - Grupo Brico*

Hola Juan Pérez! 👋

Tu turno para retirar tu compra es:
📅 *lunes, 16 de diciembre, 14:30*

📍 Sucursal: Mayorista
🆔 *Recordá traer tu DNI*

¡Te esperamos! 🎉
```

---

## 🔧 Personalización

### Cambiar horas de anticipación:

```javascript
// En seleccionar-turno.js
const CONFIG = {
    HORAS_ANTICIPACION: 4, // Cambiar a 2, 6, etc.
    ...
};
```

### Cambiar días mostrados:

```javascript
const CONFIG = {
    ...
    DIAS_MOSTRAR: 7, // Cambiar a 3, 14, etc.
};
```

### Cambiar horarios:

```javascript
const CONFIG = {
    ...
    HORA_APERTURA: 9,  // 09:00
    HORA_CIERRE: 23,   // 23:00
};
```

---

## 🧪 Probar Localmente

1. **Abre**: `http://localhost:8000/seleccionar-turno.html?unidad=Mayorista`
2. **Completa** el formulario
3. **Selecciona** un turno
4. **Confirma**

**Nota**: El WhatsApp solo se enviará si configuraste la API Key.

---

## 🌐 URL en Producción

Una vez desplegado en Vercel:

```
https://tu-proyecto.vercel.app/seleccionar-turno.html?unidad=Mayorista
https://tu-proyecto.vercel.app/seleccionar-turno.html?unidad=Express
```

---

## 📊 Ver Turnos Asignados

Los turnos seleccionados por clientes aparecen automáticamente en:

1. **Dashboard** → Pedidos con turno asignado
2. **Calendario** → Vista de staff

---

## ✅ Checklist de Implementación

- [ ] Agregar API Key de BuilderBot en `seleccionar-turno.js`
- [ ] Probar localmente
- [ ] Desplegar en Vercel
- [ ] Configurar link en BuilderBot
- [ ] Probar flujo completo desde WhatsApp
- [ ] Verificar que llega el mensaje de confirmación

---

## 🆘 Troubleshooting

### No se envía el WhatsApp:
- Verifica que la API Key sea correcta
- Revisa la consola del navegador (F12)
- Verifica que el número tenga el formato correcto

### No aparecen turnos:
- Verifica que hayan turnos disponibles (+4 horas)
- Revisa que no estén todos ocupados
- Verifica la configuración de horarios

### Error al confirmar:
- Verifica la conexión a Supabase
- Revisa los permisos RLS de la tabla `pedidos`

---

**¡El sistema está listo para usar!** 🎉

Los clientes ahora pueden seleccionar su turno de forma visual y profesional.
