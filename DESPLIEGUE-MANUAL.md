# 🚀 Despliegue Manual con Vercel CLI

## Opción 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

## Opción 2: Desplegar

```bash
# En la carpeta del proyecto
cd c:/Users/lucas/Desktop/Proyectos/brico

# Login a Vercel
vercel login

# Desplegar
vercel --prod
```

Esto desplegará directamente sin depender de GitHub.

---

## Si el problema persiste

El error 404 puede deberse a:

1. **Vercel no está vinculado al repositorio correcto**
2. **El proyecto está configurado con un framework incorrecto**
3. **Hay un problema con la detección automática de cambios**

**Solución**: Elimina el proyecto en Vercel y créalo de nuevo:
1. Ve a Settings → General → Delete Project
2. Crea un nuevo proyecto desde GitHub
3. Selecciona el repositorio `brico`
4. Framework Preset: **Other**
5. Deploy

Esto forzará a Vercel a leer la configuración correctamente.
