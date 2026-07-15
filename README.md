# BioVerse · Plataforma de Anatomía Humana en 3D

Plataforma web educativa e interactiva para explorar el cuerpo humano en 3D. Dirigida a niños,
estudiantes y profesionales de la salud, con una experiencia inmersiva tipo videojuego.

## ✨ Características

- **Landing cinematográfico** con partículas interactivas, aurora animada, parallax de scroll y microinteracciones.
- **Selección de modelo** (hombre / mujer).
- **Explorador 3D** con React Three Fiber: rotación 360°, zoom, órganos clicables, explosión anatómica, vista de rayos X y activación de sistemas por capas.
- **Fichas de órganos** con información por niveles (Infantil / Estudiante / Profesional): función, ubicación, enfermedades, prevención, curiosidades y bibliografía.
- **Gamificación**: XP, niveles, insignias y logros persistentes (localStorage).
- **Mini-juegos** jugables: Quiz anatómico y Emparejar órganos.
- **Accesibilidad**: modo claro/oscuro, alto contraste, escalado de texto, navegación por teclado y `prefers-reduced-motion`.
- **Audio** generado con Web Audio API (efectos opcionales, sin dependencias).

## 🛠️ Stack

- React 18 + TypeScript + Vite
- TailwindCSS (design system con glassmorphism)
- Three.js + @react-three/fiber + @react-three/drei
- Framer Motion (animaciones y transiciones de página)
- Zustand (estado global + persistencia)
- lucide-react (iconografía)

## 🚀 Puesta en marcha

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción
npm run preview  # previsualizar el build
```

## 📁 Estructura

```
src/
  components/    # UI reutilizable, layout, explorador, juegos, fondos
  data/          # sistemas, órganos y logros
  hooks/         # hooks (preferencias)
  lib/           # utilidades (audio)
  pages/         # Landing, GenderSelect, Explorer, Games, Progress
  store/         # estado global (zustand)
  three/         # escena 3D, cuerpo y órganos
  types/         # tipos compartidos
```

## 🧭 Cómo extender

- **Modelos GLTF reales**: sustituye los meshes procedurales de `src/three/HumanBody.tsx` y
  `OrganMesh.tsx` por modelos exportados de Blender (con Draco). Cárgalos con `useGLTF` de drei.
- **Más órganos/sistemas**: añade entradas en `src/data/organs.ts` y `src/data/systems.ts`.
- **Nuevos juegos**: crea componentes en `src/components/games/` y regístralos en `src/pages/Games.tsx`.

> Este proyecto es una base sólida y funcional. El modelado anatómico detallado (GLTF), más
> contenido educativo y juegos adicionales están preparados para incorporarse de forma incremental.
# Salud_3D
