/**
 * App Main Coordinator
 * Manages Stage Navigation, Speech Hints, and Simulators Lifecycle
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Spaceship Sprite Widgets
    const spaceshipWidget = new SpaceshipSprite('spaceship-canvas');
    const brandWidget = new SpaceshipSprite('brand-spaceship');

    // Initialize Simulators
    const aliasingSim = new AliasingSimulator('aliasing-canvas');
    const msaaSim = new MSAASimulator('msaa-canvas');
    const ssaoSim = new SSAOSimulator('ssao-canvas');

    // Stage Speech Texts for Spaceship Pilot Commander
    const speechTexts = {
        'stage-1': "¡Bienvenido Piloto! En la STAGE 1 analizamos el ALIASING (efecto escalera) en el fuselaje y las alas de la Nave Espacial. ¡Ajusta el Zoom y Ángulo para ver la discretización!",
        'stage-2': "¡STAGE 2: MSAA! Evaluamos cómo el Multi-Sample Anti-Aliasing suaviza las aristas de la nave analizando sub-muestras por píxel. ¡Compara entre 1x, 4x y 8x!",
        'stage-3': "¡STAGE 3: SSAO! Screen-Space Ambient Occlusion calcula las sombras de contacto bajo el fuselaje y alerones de la nave. ¡Modifica el Radio e Intensidad!"
    };

    // Tab Navigation Logic
    const stageBtns = document.querySelectorAll('.stage-btn');
    const stageContents = document.querySelectorAll('.stage-content');

    stageBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetStage = btn.dataset.stage;

            // Update Active Tab Button
            stageBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update Active Content Stage
            stageContents.forEach(content => {
                if (content.id === targetStage) {
                    content.classList.add('active');
                } else {
                    content.classList.remove('active');
                }
            });

            // Update Speech Bubble
            if (speechTexts[targetStage]) {
                setSpaceshipSpeech(speechTexts[targetStage]);
            }

            // Re-render active simulator canvas
            setTimeout(() => {
                if (targetStage === 'stage-1') aliasingSim.render();
                if (targetStage === 'stage-2') msaaSim.render();
                if (targetStage === 'stage-3') ssaoSim.render();
            }, 50);
        });
    });

    // Set initial speech
    setSpaceshipSpeech(speechTexts['stage-1']);
});
