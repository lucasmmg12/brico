# 📊 Análisis de Historial con OpenAI - Implementación Completada

## 🎯 Objetivo
Implementar un sistema de análisis inteligente del historial de conversaciones de WhatsApp usando OpenAI, que permita al equipo de Grupo Brico entender rápidamente:
- De qué se habló en cada conversación
- Qué promociones pidió el cliente (con cantidades exactas)
- Detalles especiales y solicitudes particulares
- Optimización de la columna "Promo" para manejar múltiples promociones

## ✅ Cambios Implementados

### 1. Base de Datos (Supabase)
**Archivo**: `supabase-migration-historial.sql`

Se agregaron dos nuevas columnas a la tabla `pedidos`:
- `historial_conversacion` (TEXT): Almacena el historial completo de la conversación
- `analisis_historial` (JSONB): Almacena el análisis generado por OpenAI con estructura:
  ```json
  {
    "resumen": "Resumen breve de la conversación",
    "promociones_detalle": [
      {
        "nombre": "Nombre de la promoción",
        "cantidad": 2,
        "observaciones": "Detalles especiales"
      }
    ],
    "intenciones_cliente": ["Lista de intenciones"],
    "puntos_clave": ["Puntos importantes"],
    "tono_conversacion": "amigable/formal/urgente"
  }
  ```

**Cómo aplicar**:
```sql
-- Ejecutar en Supabase SQL Editor
-- El archivo contiene la migración completa
```

### 2. Edge Functions (Supabase)
**Archivos modificados**:
- `edge-function-v2-builderbot.ts` (Mayorista)
- `edge-function-express-builderbot.ts` (Express)

**Cambios**:
1. Se agregó función `generarAnalisisHistorial()` que usa GPT-4o-mini para analizar conversaciones
2. El análisis se genera automáticamente al crear cada pedido
3. Se guarda tanto el historial completo como el análisis en la base de datos

**Características del análisis**:
- Identifica múltiples promociones y cantidades
- Detecta observaciones especiales (ej: "Paleta Azul", "Sin cebolla")
- Analiza el tono de la conversación
- Extrae intenciones y puntos clave

### 3. Dashboard (Frontend)
**Archivos modificados**:
- `app-v3.js`: Lógica del dashboard
- `index.html`: Estructura HTML
- `styles-analisis.css`: Estilos para el modal de análisis (nuevo)

**Funcionalidades agregadas**:
1. **Botón "Ver" (🔍)**: Aparece en la columna "Acciones" para pedidos con análisis
2. **Modal de Análisis**: Muestra de forma visual y organizada:
   - Información del cliente
   - Resumen de la conversación
   - Promociones solicitadas con cantidades
   - Intenciones del cliente
   - Puntos clave
   - Historial completo de mensajes

**Diseño del Modal**:
- Header con gradiente morado
- Secciones organizadas con iconos
- Promociones con badges de cantidad
- Historial de mensajes con colores diferenciados:
  - Cliente: Azul
  - Agente: Verde
  - Sistema: Gris
- Animaciones suaves de entrada
- Responsive design

## 📋 Pasos para Desplegar

### Paso 1: Actualizar Base de Datos
```bash
# 1. Ir a Supabase Dashboard
# 2. SQL Editor > New Query
# 3. Copiar y ejecutar: supabase-migration-historial.sql
```

### Paso 2: Actualizar Edge Functions
```bash
# Desde la carpeta del proyecto
cd supabase/functions

# Actualizar función de Mayorista
supabase functions deploy crear-pedido-whatsapp --project-ref TU_PROJECT_REF

# Actualizar función de Express
supabase functions deploy crear-pedido-express-whatsapp --project-ref TU_PROJECT_REF
```

### Paso 3: Verificar Variables de Entorno
Asegurarse que en Supabase Dashboard > Edge Functions > Settings estén configuradas:
- `OPENAI_API_KEY`: Tu API key de OpenAI
- `SUPABASE_URL`: URL de tu proyecto
- `SUPABASE_ANON_KEY`: Anon key de Supabase
- `BUILDERBOT_API_URL`: URL de BuilderBot
- `BUILDERBOT_API_KEY`: API key de BuilderBot

### Paso 4: Desplegar Frontend
```bash
# Si usas Vercel
vercel --prod

# O simplemente hacer commit y push si tienes auto-deploy configurado
git add .
git commit -m "feat: Análisis de historial con OpenAI"
git push origin main
```

## 🧪 Cómo Probar

### 1. Crear un Pedido de Prueba desde WhatsApp
El sistema automáticamente:
- Guardará el historial completo
- Generará el análisis con OpenAI
- Lo almacenará en la base de datos

### 2. Ver el Análisis en el Dashboard
1. Abrir el dashboard
2. Buscar el pedido recién creado
3. Hacer clic en el botón "🔍 Ver" en la columna Acciones
4. Se abrirá el modal con el análisis completo

## 💡 Casos de Uso

### Ejemplo 1: Cliente pide múltiples promociones
**Conversación**:
```
Cliente: Hola, quiero 2 Promo 4 y 1 Promo 8
Agente: Perfecto! Son $45,280. ¿Nombre?
Cliente: Juan Pérez
```

**Análisis generado**:
```json
{
  "resumen": "Cliente solicita 2 unidades de Promo 4 y 1 unidad de Promo 8",
  "promociones_detalle": [
    {"nombre": "PROMO 4", "cantidad": 2, "observaciones": ""},
    {"nombre": "PROMO 8", "cantidad": 1, "observaciones": ""}
  ],
  "intenciones_cliente": ["Comprar múltiples promociones"],
  "puntos_clave": ["Pedido de 3 productos en total"],
  "tono_conversacion": "amigable"
}
```

### Ejemplo 2: Cliente con observaciones especiales
**Conversación**:
```
Cliente: Quiero la Promo 1 pero sin cebolla
Agente: Perfecto, anotado sin cebolla
```

**Análisis generado**:
```json
{
  "promociones_detalle": [
    {
      "nombre": "PROMO 1",
      "cantidad": 1,
      "observaciones": "Sin cebolla"
    }
  ]
}
```

## 🎨 Personalización

### Modificar el Prompt de Análisis
Editar en `edge-function-v2-builderbot.ts` y `edge-function-express-builderbot.ts`:
```typescript
const prompt = `Analiza la siguiente conversación...
// Modificar aquí las instrucciones para OpenAI
`;
```

### Ajustar Estilos del Modal
Editar `styles-analisis.css`:
```css
.analisis-header {
    /* Cambiar colores, tamaños, etc. */
}
```

## 📊 Optimización de Columna "Promo"

El sistema ahora:
1. **Identifica cantidades**: Detecta cuando el cliente pide múltiples unidades
2. **Múltiples promociones**: Reconoce combinaciones de promociones
3. **Observaciones**: Captura detalles especiales de cada promoción
4. **Visualización clara**: Muestra todo en el modal de análisis

## 🔧 Troubleshooting

### El botón "Ver" no aparece
- Verificar que el pedido tenga `analisis_historial` en la base de datos
- Revisar la consola del navegador para errores

### El análisis está vacío
- Verificar que `OPENAI_API_KEY` esté configurada correctamente
- Revisar los logs de la Edge Function en Supabase

### Error al generar análisis
- El sistema tiene fallback: si OpenAI falla, guarda un análisis básico
- Revisar límites de tokens de OpenAI

## 📈 Próximos Pasos (Opcional)

1. **Análisis de Sentimiento**: Agregar análisis de satisfacción del cliente
2. **Alertas Automáticas**: Notificar si el cliente menciona problemas
3. **Estadísticas**: Dashboard con métricas de promociones más pedidas
4. **Búsqueda**: Buscar pedidos por contenido del historial

## 🎉 Resultado Final

Ahora el equipo de Grupo Brico puede:
- ✅ Ver rápidamente de qué habló cada cliente
- ✅ Entender qué promociones pidió (con cantidades exactas)
- ✅ Identificar observaciones especiales
- ✅ Tener contexto completo de cada pedido
- ✅ Optimizar la atención al cliente

---

**Desarrollado por**: Grow Labs  
**Tecnologías**: OpenAI GPT-4o-mini, Supabase, JavaScript  
**Fecha**: Diciembre 2024
