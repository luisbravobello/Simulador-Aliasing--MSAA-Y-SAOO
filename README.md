# 🚀 Simulador Gráfico OpenGL: Aliasing, MSAA y SSAO

Simulador educativo interactivo sobre técnicas de renderizado en gráficos por computadora, ambientado con una nave espacial retro estilo arcade (pixel art). Desarrollado como proyecto para la asignatura de **Computación Gráfica**.

Explica y visualiza tres conceptos fundamentales del pipeline gráfico:

- **Aliasing** — el efecto escalera (*jaggies*) al representar formas continuas en una grilla discreta de píxeles.
- **MSAA (Multi-Sample Anti-Aliasing)** — cómo se suavizan los bordes evaluando sub-muestras por píxel.
- **SSAO (Screen-Space Ambient Occlusion)** — cómo se simulan sombras de contacto en tiempo real usando el buffer de profundidad.

## 🎮 Demo en vivo

👉 **[Ver simulador en GitHub Pages](#)** *(actualiza este enlace una vez publicado)*

## 🖥️ Características

- **Stage 1 — Aliasing:** canvas interactivo con zoom, rotación, toggle de grilla de píxeles y suavizado nativo, sobre un sprite de nave espacial dibujado píxel a píxel.
- **Stage 2 — MSAA:** comparación visual entre 1x, 2x, 4x y 8x muestras, con visualización de sub-píxeles y estadística de cobertura.
- **Stage 3 — SSAO:** escena 3D isométrica con oclusión ambiental activable, control de radio e intensidad, y modos de vista (escena final / solo sombras / mapa de profundidad).
- Widget de "piloto" acompañante con mensajes contextuales por etapa.
- Código de ejemplo en **OpenGL / FreeGLUT (C/C++)** y **GLSL** en cada sección, explicando la técnica correspondiente a nivel de motor gráfico real.
- Estética retro pixel-art / HUD de videojuego arcade, con tipografía *Press Start 2P*.

## 🛠️ Tecnologías

- HTML5 + Canvas API
- CSS3 (sin frameworks)
- JavaScript Vanilla (sin librerías ni build step)

No requiere instalación, dependencias ni proceso de build — es un sitio estático puro.

## 📁 Estructura del proyecto

```
Simulador Aliasing, MSAA Y SAOO/
├── index.html          # Estructura principal y las 3 etapas (stages)
├── css/
│   └── styles.css      # Estilos, tema retro/HUD y paleta de colores
└── js/
    ├── spaceship.js    # Clase SpaceshipSprite (sprite animado del piloto/HUD)
    ├── aliasing.js     # Clase AliasingSimulator (Stage 1)
    ├── msaa.js          # Clase MSAASimulator (Stage 2)
    ├── ssao.js          # Clase SSAOSimulator (Stage 3)
    └── app.js           # Coordinador: navegación entre stages e inicialización
```

## ▶️ Cómo correrlo localmente

Al ser HTML/CSS/JS puro, basta con abrir `index.html` en el navegador. Para evitar problemas de rutas relativas, se recomienda servirlo con un servidor local simple:

```bash
# Con Python
python3 -m http.server 8000

# o con la extensión Live Server de VS Code
```

Luego visita `http://localhost:8000`.

## 🌐 Publicar en GitHub Pages

1. Crea un repositorio en GitHub y sube el contenido de esta carpeta a la rama `main`.
2. Ve a **Settings → Pages** en tu repositorio.
3. En **Source**, selecciona la rama `main` y la carpeta `/ (root)`.
4. Guarda. GitHub Pages publicará el sitio en unos minutos en:
   `https://<tu-usuario>.github.io/<nombre-del-repo>/`

##  Desarrollador

Luis Alejandro Bravo Bello

## 📄 Licencia

Uso académico / educativo.
