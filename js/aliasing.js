/**
 * Stage 1: Aliasing Simulator Module
 * Explains and visualizes spatial aliasing (staircase / jaggies effect)
 */

class AliasingSimulator {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        // State controls - DEFAULT ROTATION IS 0° (UPRIGHT EXACT SPRITE)
        this.zoom = 1;
        this.showGrid = true;
        this.enableSmoothing = false;
        this.renderShape = 'sprite'; // Spaceship sprite
        this.rotationAngle = 0; // Default to 0 degrees so it's upright!

        // Spaceship Palette - exact colors extracted from the original reference image
        this.colors = {
            bg: '#121212',
            grid: '#424242',
            lineColor: '#00E5FF',
            polyColor: '#0288D1',
            '.': null,
            'A': null,       // Background of the source image -> transparent
            'B': '#000000',  // Black outline
            'C': '#f0e9e9',  // Nose tip / wing tip highlight
            'D': '#729bde',  // Cockpit window (blue)
            'E': '#d1d1d1',  // Main hull (light gray)
            'F': '#85888c',  // Hull shadow (medium gray)
            'G': '#ffffff',  // Cockpit glass highlight (white)
            'H': '#5aa66e',  // Engine mid green
            'I': '#9fcab5',  // Engine light green highlight
            'J': '#1e753e',  // Engine dark green
            'K': '#ede6e6',  // Wing tip highlight
            'L': '#e65825',  // Flame - dark orange
            'M': '#ff751f',  // Flame - orange
            'N': '#ffe208'   // Flame - yellow core
        };

        // 44x47 Spaceship Matrix, extracted pixel-by-pixel from the original reference image
        this.spaceshipSprite = [
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "AAAAAAAAAAAAAAAAAAAAAABBAAAAAAAAAAAAAAAAAAAA",
            "AAAAAAAAAAAAAAAAAAAAABCCBAAAAAAAAAAAAAAAAAAA",
            "AAAAAAAAAAAAAAAAAAAABCBBCBAAAAAAAAAAAAAAAAAA",
            "AAAAAAAAAAAAAAAAAAABCBDDBCBAAAAAAAAAAAAAAAAA",
            "AAAAAAAAAAAAAAAAAABCEBDDBECBAAAAAAAAAAAAAAAA",
            "AAAAAAAAAAAAAAAAABFEEBGGBEEFBAAAAAAAAAAAAAAA",
            "AAAAAAAAAAAAAAAAABFEEBDDBEEFBAAAAAAAAAAAAAAA",
            "AAAAAAAAAAAAAAAAABFEEEBBEEEFBAAAAAAAAAAAAAAA",
            "AAAAAAAAAAAAAAAAABFEEEEEEEEFBAAAAAAAAAAAAAAA",
            "AAAAAAAAAAAAAAAAABFEEEEEEEEFBAAAAAAAAAAAAAAA",
            "AAAAAAAAAAAAAAAAABFEEEBBEEEFBAAAAAAAAAAAAAAA",
            "AAAAAAAAAAAAAABAABFEEBHHBEEFBAABAAAAAAAAAAAA",
            "AAAAAAAAAAAAAABACBFEEBHHBEEFBCABAAAAAAAAAAAA",
            "AAAAAAAAAAAAAABABCBEEBHHBEEBCBABAAAAAAAAAAAA",
            "AAAAAAAAAAAAAABABCFBEBIIBEBFCBABAAAAAAAAAAAA",
            "AAAAAAAAAAAAAABBCEFBEBHHBEBFECBBAAAAAAAAAAAA",
            "AAAAAAAAAAAAAABBCEFBBHHHHBBFECBBAAAAAAAAAAAA",
            "AAAAAAAAAAAAAABCEEFBJHHHHJBFEECBAAAAAAAAAAAA",
            "AAAAAAAAAAAAABCEEEFBFIIIIFBFEEECBAAAAAAAAAAA",
            "AAAAAAAAAAAAABKEEEFBFIIIIFBFEEEKBAAAAAAAAAAA",
            "AAAAAAAAAAAABCEEEEFBJHHHHJBFEEEECBAAAAAAAAAA",
            "AAAAAAAAAAABCEEEEEBFBHHHHBFBEEEEECBAAAAAAAAA",
            "AAAAAAAAAABCEEEEEBBFIBHHBIFBBEEEEECBAAAAAAAA",
            "AAAAAAAAABCEEEEEBFBFIBHHBIFBFBEEEEECBAAAAAAA",
            "AAAAAAAABBEEEEEBEFBFIBHHBIFBFEBEEEEEBBAAAAAA",
            "AAAAAAABJBEEEEBEEFBBBBIIBBBBFEEBEEEEBJBAAAAA",
            "AAAAAAABJBEEEBBEEFBFIBHHBIFBFEEBBEEEBJBAAAAA",
            "AAAAAAABJBEEBEBEEFBFIBHHBIFBFEEBEBEEBJBAAAAA",
            "AAAAAABHJBEBEEBEEFBFIBHHBIFBFEEBEEBEBJHBAAAA",
            "AAAAAABHJBBEEEBEEFBBBBHHBBBBFEEBEEEBBJHBAAAA",
            "AAAAAABHJBEEEEBEEFBFIBHHBIFBFEEBEEEEBJHBAAAA",
            "AAAAAABHJBEEEEBFFBBBBBBBBBBBBFFBEEEEBJHBAAAA",
            "AAAAAABHJBEEEFBBBAABBBBBBBBAABBBFEEEBJHBAAAA",
            "AAAAAABHJBEEFBAAAAAALMNNMLAAAAAABFEEBJHBAAAA",
            "AAAAAABHJBEFBAAAAAAALMMNMLAAAAAAABFEBJHBAAAA",
            "AAAAAABHJBFBAAAAAAAAALNMLAAAAAAAAABFBJHBAAAA",
            "AAAAAABHJBBAAAAAAAAAALMMLAAAAAAAAAABBJHBAAAA",
            "AAAAAABHJBAAAAAAAAAAAALLAAAAAAAAAAAABJHBAAAA",
            "AAAAAABHBAAAAAAAAAAAAAAAAAAAAAAAAAAAABHBAAAA",
            "AAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAA",
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
        ];

        this.initEventListeners();
        this.render();
    }

    initEventListeners() {
        const zoomInput = document.getElementById('alias-zoom');
        if (zoomInput) {
            zoomInput.addEventListener('input', (e) => {
                this.zoom = parseFloat(e.target.value);
                document.getElementById('alias-zoom-val').textContent = `${this.zoom}x`;
                this.render();
            });
        }

        const angleInput = document.getElementById('alias-angle');
        if (angleInput) {
            angleInput.addEventListener('input', (e) => {
                this.rotationAngle = parseInt(e.target.value);
                document.getElementById('alias-angle-val').textContent = `${this.rotationAngle}°`;
                this.render();
            });
        }

        const gridBtn = document.getElementById('alias-toggle-grid');
        if (gridBtn) {
            gridBtn.addEventListener('click', () => {
                this.showGrid = !this.showGrid;
                gridBtn.classList.toggle('active', this.showGrid);
                this.render();
            });
        }

        const smoothBtn = document.getElementById('alias-toggle-smooth');
        if (smoothBtn) {
            smoothBtn.addEventListener('click', () => {
                this.enableSmoothing = !this.enableSmoothing;
                smoothBtn.classList.toggle('active', this.enableSmoothing);
                this.render();
            });
        }

        const shapeBtns = document.querySelectorAll('.alias-shape-btn');
        shapeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                shapeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderShape = btn.dataset.shape;
                this.render();
            });
        });
    }

    render() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        this.ctx.clearRect(0, 0, width, height);

        // Background
        this.ctx.fillStyle = this.colors.bg;
        this.ctx.fillRect(0, 0, width, height);

        this.ctx.save();

        // Center view
        this.ctx.translate(width / 2, height / 2);
        this.ctx.scale(this.zoom, this.zoom);

        // Toggle native canvas anti-aliasing
        this.ctx.imageSmoothingEnabled = this.enableSmoothing;

        if (this.renderShape === 'line') {
            this.renderDiagonalLine();
        } else if (this.renderShape === 'triangle') {
            this.renderTriangle();
        } else if (this.renderShape === 'sprite') {
            this.renderSpaceshipSprite();
        }

        this.ctx.restore();

        // Render Pixel Grid Overlay (Screen Space)
        if (this.showGrid) {
            this.renderPixelGrid(width, height);
        }
    }

    renderDiagonalLine() {
        const rad = (this.rotationAngle * Math.PI) / 180;
        const len = 200;

        const x1 = -Math.cos(rad) * len;
        const y1 = -Math.sin(rad) * len;
        const x2 = Math.cos(rad) * len;
        const y2 = Math.sin(rad) * len;

        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = this.colors.lineColor;

        if (!this.enableSmoothing) {
            this.drawAliasedLine(x1, y1, x2, y2, 4, this.colors.lineColor);
        } else {
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
    }

    renderTriangle() {
        const rad = (this.rotationAngle * Math.PI) / 180;

        this.ctx.save();
        this.ctx.rotate(rad);

        this.ctx.fillStyle = this.colors.polyColor;
        this.ctx.strokeStyle = this.colors.lineColor;
        this.ctx.lineWidth = 3;

        this.ctx.beginPath();
        this.ctx.moveTo(0, -120);
        this.ctx.lineTo(100, 80);
        this.ctx.lineTo(-100, 80);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.restore();
    }

    renderSpaceshipSprite() {
        // Draw Authentic Spaceship Sprite from User Image
        const matrix = this.spaceshipSprite;
        const rows = matrix.length;
        const cols = matrix[0].length;

        const pixelSize = 7;
        const totalW = cols * pixelSize;
        const totalH = rows * pixelSize;

        const rad = (this.rotationAngle * Math.PI) / 180;

        this.ctx.save();
        this.ctx.rotate(rad);

        // Center sprite
        const startX = -totalW / 2;
        const startY = -totalH / 2;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const char = matrix[r][c];
                const color = this.colors[char];
                if (color) {
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(
                        Math.floor(startX + c * pixelSize),
                        Math.floor(startY + r * pixelSize),
                        pixelSize,
                        pixelSize
                    );
                }
            }
        }

        this.ctx.restore();
    }

    drawAliasedLine(x1, y1, x2, y2, thickness, color) {
        const pixelGridSize = 4;

        // Trabajar directamente en coordenadas de grilla (celdas), no en píxeles continuos.
        // Esto garantiza que el paso de Bresenham avance exactamente 1 celda por vez.
        let gx1 = Math.floor(x1 / pixelGridSize);
        let gy1 = Math.floor(y1 / pixelGridSize);
        const gx2 = Math.floor(x2 / pixelGridSize);
        const gy2 = Math.floor(y2 / pixelGridSize);

        const dx = Math.abs(gx2 - gx1);
        const dy = Math.abs(gy2 - gy1);
        const sx = gx1 < gx2 ? 1 : -1;
        const sy = gy1 < gy2 ? 1 : -1;
        let err = dx - dy;

        this.ctx.fillStyle = color;

        // Límite de seguridad: en el peor caso el número de pasos es dx + dy.
        // Se añade margen extra para evitar cualquier congelamiento si algo inesperado ocurre.
        const maxSteps = dx + dy + 4;
        let steps = 0;

        while (steps <= maxSteps) {
            this.ctx.fillRect(gx1 * pixelGridSize, gy1 * pixelGridSize, pixelGridSize, pixelGridSize);

            if (gx1 === gx2 && gy1 === gy2) break;

            const e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                gx1 += sx;
            }
            if (e2 < dx) {
                err += dx;
                gy1 += sy;
            }

            steps++;
        }
    }

    renderPixelGrid(width, height) {
        const step = Math.max(8, Math.floor(16 * (this.zoom / 2)));
        this.ctx.strokeStyle = this.colors.grid;
        this.ctx.lineWidth = 0.5;

        this.ctx.beginPath();
        for (let x = 0; x < width; x += step) {
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
        }
        for (let y = 0; y < height; y += step) {
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
        }
        this.ctx.stroke();
    }
}