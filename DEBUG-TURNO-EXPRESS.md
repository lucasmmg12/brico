# 🔍 Debug: Problema con Turno Express

## Síntoma
- Pedido Express se crea correctamente
- Cliente recibe link de selección de turno
- Cliente selecciona turno
- Dashboard muestra "SIN TURNO"

## Verificaciones necesarias

### 1. Verificar que el link tenga el pedido_id correcto

**En logs de Supabase (función Express):**
Buscar: `✅ Pedido EXPRESS creado:`

Debería mostrar algo como:
```
{
  id: "abc-123-def",
  cliente_nombre: "Lucas Marinero",
  ...
}
```

**Luego buscar:**
`📤 Enviando mensaje a:`

El link debería ser:
```
https://brico-dashboard.vercel.app/seleccionar-turno.html?pedido_id=abc-123-def&unidad=Express
```

### 2. Verificar en la base de datos

Ejecutar en Supabase SQL Editor:

```sql
-- Ver el último pedido Express
SELECT 
    id,
    cliente_nombre,
    cliente_telefono,
    unidad_negocio,
    turno_fecha,
    turno_hora,
    turno_confirmado,
    created_at
FROM pedidos
WHERE unidad_negocio = 'Express'
ORDER BY created_at DESC
LIMIT 5;
```

**Verificar:**
- ¿El pedido tiene `turno_fecha` y `turno_hora`?
- ¿`turno_confirmado` es `true`?

### 3. Verificar logs de seleccionar-turno.html

**En el navegador (F12 → Console):**

Cuando el cliente selecciona el turno, debería aparecer:
```
🔍 Pedido ID desde URL: abc-123-def
📝 Actualizando pedido: abc-123-def
✅ Turno confirmado exitosamente
```

Si aparece:
```
🔍 Buscando pedido existente por teléfono: ...
```

Significa que **NO está llegando el pedido_id** en la URL.

### 4. Posibles causas

#### Causa A: Link mal formado
El link en el mensaje de WhatsApp no tiene el `pedido_id` correcto.

**Solución:** Verificar logs de la Edge Function Express.

#### Causa B: Parámetro `unidad` incorrecto
El link tiene `unidad=Express` pero la búsqueda espera otro valor.

**Solución:** Verificar que en `seleccionar-turno.js` se lee correctamente:
```javascript
const urlParams = new URLSearchParams(window.location.search);
const pedidoId = urlParams.get('pedido_id');
const unidad = urlParams.get('unidad');
```

#### Causa C: Pedido duplicado
Se creó un pedido nuevo en lugar de actualizar el existente.

**Solución:** Verificar en la DB si hay 2 pedidos con el mismo teléfono.

### 5. Test rápido

**Copiar el link que recibió el cliente** y pegarlo aquí para verificar que tenga este formato:

```
https://brico-dashboard.vercel.app/seleccionar-turno.html?pedido_id=XXXXX&unidad=Express
```

Donde `XXXXX` debe ser un UUID válido.

---

## Solución temporal

Si el problema persiste, podemos agregar más logs en `seleccionar-turno.js` para debuggear:

```javascript
console.log('🔍 URL completa:', window.location.href);
console.log('🔍 Parámetros:', {
    pedido_id: urlParams.get('pedido_id'),
    unidad: urlParams.get('unidad')
});
```
