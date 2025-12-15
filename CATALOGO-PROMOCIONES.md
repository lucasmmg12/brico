# 📦 Catálogo de Promociones - Grupo Brico

## 🎯 Promociones Disponibles

### 📋 **PROMOCIONES CLÁSICAS**

#### **Promo 1 Clásica** - $19.499,00
- Mayonesa x 500 (Hellmans)
- Pan de Miga x 50 (Pan. Leo)
- Queso Barra 500gr (Leig Lac)
- Paleta Etiq. Azul 500gr (Grassetto)

#### **Promo 2 Clásica** - $19.950,00
- Mayonesa x 500 (Hellmans)
- Pan de Miga x 50 (Pan. Leo)
- Queso Barra 500gr (Leig Lac)
- Paleta Cocida 500gr (JC Welschen)

#### **Promo 3 Clásica** - $20.450,00
- Mayonesa x 500 (Hellmans)
- Pan de Miga x 50 (Pan. Leo)
- Queso Barra 500gr (Leig Lac)
- Jamón Cocido Etiq. Roja 500gr (Grassetto)

#### **Promo 4 Clásica** - $21.390,00
- Mayonesa x 500 (Hellmans)
- Pan de Miga x 50 (Pan. Leo)
- Queso Barra 500gr (Leig Lac)
- Salame Milán 500gr (66)

#### **Promo 5 Clásica** - $20.650,00
- Mayonesa x 500 (Hellmans)
- Pan de Miga x 50 (Pan. Leo)
- Queso Barra 500gr (Leig Lac)
- Salame Milán 250gr (66)
- Paleta Cocida 250gr (JC Welschen)

#### **Promo 6 Clásica** - $24.450,00
- Mayonesa x 500 (Hellmans)
- Pan de Miga x 50 (Pan. Leo)
- Queso Barra 500gr (Leig Lac)
- Jamón Crudo 250gr (Mundial)
- Jamón Cocido Etiq. Roja 250gr (Grassetto)

---

### 📦 **PROMOCIONES XL**

#### **Promo 1 XL** - $20.399,00
- Mayonesa x 500 (Hellmans)
- Pan de Miga x 50 (Pan. Leo)
- Queso Barra 600gr (Leig Lac)
- Paleta Etiq. Azul 500gr (Grassetto)

#### **Promo 2 XL** - $20.950,00
- Mayonesa x 500 (Hellmans)
- Pan de Miga x 50 (Pan. Leo)
- Queso Barra 600gr (Leig Lac)
- Paleta Cocida 600gr (JC Welschen)

#### **Promo 3 XL** - $21.550,00
- Mayonesa x 500 (Hellmans)
- Pan de Miga x 50 (Pan. Leo)
- Queso Barra 600gr (Leig Lac)
- Jamón Cocido Etiq. Roja 600gr (Grassetto)

#### **Promo 4 XL** - $22.640,00
- Mayonesa x 500 (Hellmans)
- Pan de Miga x 50 (Pan. Leo)
- Queso Barra 600gr (Leig Lac)
- Salame Milán 600gr (66)

#### **Promo 5 XL** - $21.800,00
- Mayonesa x 500 (Hellmans)
- Pan de Miga x 50 (Pan. Leo)
- Queso Barra 600gr (Leig Lac)
- Salame Milán 300gr (66)
- Paleta Cocida 300gr (JC Welschen)

#### **Promo 6 XL** - $26.250,00
- Mayonesa x 500 (Hellmans)
- Pan de Miga x 50 (Pan. Leo)
- Queso Barra 600gr (Leig Lac)
- Jamón Crudo 300gr (Mundial)
- Jamón Cocido Etiq. Roja 300gr (Grassetto)

---

## 📊 **Comparativa de Precios**

| Promoción | Clásica | XL | Diferencia |
|-----------|---------|-----|------------|
| Promo 1 | $19.499 | $20.399 | +$900 |
| Promo 2 | $19.950 | $20.950 | +$1.000 |
| Promo 3 | $20.450 | $21.550 | +$1.100 |
| Promo 4 | $21.390 | $22.640 | +$1.250 |
| Promo 5 | $20.650 | $21.800 | +$1.150 |
| Promo 6 | $24.450 | $26.250 | +$1.800 |

---

## 🏷️ **Marcas Incluidas**

- **Hellmans** - Mayonesa
- **Pan. Leo** - Pan de Miga
- **Leig Lac** - Queso Barra
- **Grassetto** - Paleta Etiq. Azul, Jamón Cocido Etiq. Roja
- **JC Welschen** - Paleta Cocida
- **66** - Salame Milán
- **Mundial** - Jamón Crudo

---

## 📸 **Imágenes Disponibles**

Las imágenes de las promociones están en la carpeta `public/`:

- `Promo 1.jpg`
- `Promo 2 feed.jpg`
- `Promo 3 feed.jpg`
- `Promo 4 feed.jpg`
- `Promo 5 feed.jpg`
- `Promo 6 feed.jpg`

---

## 💡 **Diferencias Clásica vs XL**

### **Promociones Clásicas:**
- Queso Barra: **500gr**
- Fiambres: **500gr** (o 250gr en promos mixtas)

### **Promociones XL:**
- Queso Barra: **600gr** (+100gr)
- Fiambres: **600gr** (o 300gr en promos mixtas) (+100gr/+50gr)

---

## 🔧 **Uso en el Sistema**

### **Archivo de Datos**
El archivo `promociones-data.js` contiene:

```javascript
// Obtener todas las promociones
const todasLasPromos = obtenerTodasLasPromociones();

// Obtener solo clásicas
const clasicas = obtenerPromocionesPorTipo('clasica');

// Obtener solo XL
const xl = obtenerPromocionesPorTipo('xl');

// Obtener precio por nombre
const precio = obtenerPrecioPorNombre('Promo 1 Clásica'); // 19499.00

// Obtener promoción completa
const promo = obtenerPromocionPorId('promo-1-clasica');
```

### **Integración con Formularios**

En el formulario de nuevo pedido, puedes:

1. **Selector de Promoción**: Dropdown con todas las promos
2. **Autocompletar Precio**: Al seleccionar promo, se completa el monto
3. **Mostrar Productos**: Listar los productos incluidos
4. **Mostrar Imagen**: Previsualizar la imagen de la promo

---

## 📝 **Notas Importantes**

- ✅ Todas las promociones incluyen **Mayonesa x 500** y **Pan de Miga x 50**
- ✅ La diferencia principal está en el **tipo de fiambre** y **peso del queso**
- ✅ Las promos 5 y 6 incluyen **2 tipos de fiambres** (mixtas)
- ✅ Los precios son **finales** e incluyen todos los productos
- ✅ Las imágenes están optimizadas para web (formato JPG)

---

## 🎯 **Recomendaciones de Venta**

### **Promo 1** (Más Económica)
- Ideal para: Clientes que buscan precio bajo
- Diferenciador: Paleta Etiq. Azul

### **Promo 2**
- Ideal para: Clientes que prefieren paleta cocida
- Diferenciador: Paleta Cocida JC Welschen

### **Promo 3**
- Ideal para: Clientes que prefieren jamón
- Diferenciador: Jamón Cocido Grassetto

### **Promo 4**
- Ideal para: Amantes del salame
- Diferenciador: Salame Milán 66

### **Promo 5** (Mixta)
- Ideal para: Variedad de fiambres
- Diferenciador: Salame + Paleta

### **Promo 6** (Premium)
- Ideal para: Clientes que buscan calidad
- Diferenciador: Jamón Crudo + Jamón Cocido

---

**Última actualización:** Diciembre 2024
**Total de promociones:** 12 (6 Clásicas + 6 XL)
