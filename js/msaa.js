/**
 * Stage 2: MSAA Simulator Module
 * Visualizes Multi-Sample Anti-Aliasing sub-pixel sampling grids (1x, 2x, 4x, 8x)
 */

class MSAASimulator {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.msaaSamples = 4; // 1, 2, 4, 8
        this.showSubpixels = true;
        this.edgeAngle = 25;

        // Subpixel sample patterns inside normalized [0,1] pixel box
        this.samplePatterns = {
            1: [
                { x: 0.5, y: 0.5 }
            ],
            2: [
                { x: 0.25, y: 0.25 },
                { x: 0.75, y: 0.75 }
            ],
            4: [ // Rotated grid pattern used in standard GPUs
                { x: 0.375, y: 0.125 },
                { x: 0.875, y: 0.375 },
                { x: 0.125, y: 0.625 },
                { x: 0.625, y: 0.875 }
            ],
            8: [
                { x: 0.5625, y: 0.0625 },
                { x: 0.1875, y: 0.1875 },
                { x: 0.8125, y: 0.3125 },
                { x: 0.4375, y: 0.4375 },
                { x: 0.0625, y: 0.5625 },
                { x: 0.6875, y: 0.6875 },
                { x: 0.3125, y: 0.8125 },
                { x: 0.9375, y: 0.9375 }
            ]
        };

        this.initEventListeners();
        this.render();
    }

    initEventListeners() {
        const sampleBtns = document.querySelectorAll('.msaa-sample-btn');
        sampleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                sampleBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.msaaSamples = parseInt(btn.dataset.samples);
                const levelValElem = document.getElementById('msaa-level-val');
                if (levelValElem) {
                    levelValElem.textContent = `${this.msaaSamples}x MSAA`;
                }
                this.render();
            });
        });

        const angleInput = document.getElementById('msaa-angle');
        if (angleInput) {
            angleInput.addEventListener('input', (e) => {
                this.edgeAngle = parseInt(e.target.value);
                document.getElementById('msaa-angle-val').textContent = `${this.edgeAngle}°`;
                this.render();
            });
        }

        const subpixelBtn = document.getElementById('msaa-toggle-sub');
        if (subpixelBtn) {
            subpixelBtn.addEventListener('click', () => {
                this.showSubpixels = !this.showSubpixels;
                subpixelBtn.classList.toggle('active', this.showSubpixels);
                this.render();
            });
        }
    }

    render() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        this.ctx.clearRect(0, 0, width, height);

        // Background
        this.ctx.fillStyle = '#121212';
        this.ctx.fillRect(0, 0, width, height);

        // Draw side-by-side or detailed sub-pixel grid visualization
        const gridCols = 8;
        const gridRows = 6;
        const cellWidth = width / gridCols;
        const cellHeight = height / gridRows;

        // Line equation for edge: y = m*x + c
        const rad = (this.edgeAngle * Math.PI) / 180;
        const m = Math.tan(rad);
        const centerX = width / 2;
        const centerY = height / 2;

        const pattern = this.samplePatterns[this.msaaSamples];
        const triangleColor = { r: 2, g: 136, b: 209 }; // Cyan/Blue armor #0288D1
        const bgColor = { r: 33, g: 33, b: 33 };       // #212121

        let totalSubsamples = 0;
        let activeSubsamples = 0;

        // Render each pixel in the grid
        for (let r = 0; r < gridRows; r++) {
            for (let c = 0; c < gridCols; c++) {
                const pxLeft = c * cellWidth;
                const pxTop = r * cellHeight;

                // Evaluate subsamples inside this pixel
                let coveredCount = 0;

                pattern.forEach(p => {
                    totalSubsamples++;
                    const subX = pxLeft + p.x * cellWidth;
                    const subY = pxTop + p.y * cellHeight;

                    // Check if subpixel is inside the geometric polygon/triangle
                    // Edge line test relative to center
                    const dx = subX - centerX;
                    const dy = subY - centerY;
                    const isInside = (dy - m * dx) < 0;

                    if (isInside) {
                        coveredCount++;
                        activeSubsamples++;
                    }
                });

                // Calculate coverage percentage (Alpha)
                const coverage = coveredCount / pattern.length;

                // Color blending based on MSAA coverage
                const red = Math.round(bgColor.r + (triangleColor.r - bgColor.r) * coverage);
                const green = Math.round(bgColor.g + (triangleColor.g - bgColor.g) * coverage);
                const blue = Math.round(bgColor.b + (triangleColor.b - bgColor.b) * coverage);

                // Fill pixel cell
                this.ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
                this.ctx.fillRect(pxLeft + 1, pxTop + 1, cellWidth - 2, cellHeight - 2);

                // Draw pixel cell border
                this.ctx.strokeStyle = '#424242';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(pxLeft, pxTop, cellWidth, cellHeight);

                // Draw Subpixel points if enabled
                if (this.showSubpixels) {
                    pattern.forEach(p => {
                        const subX = pxLeft + p.x * cellWidth;
                        const subY = pxTop + p.y * cellHeight;

                        const dx = subX - centerX;
                        const dy = subY - centerY;
                        const isInside = (dy - m * dx) < 0;

                        this.ctx.beginPath();
                        this.ctx.arc(subX, subY, 3, 0, Math.PI * 2);
                        this.ctx.fillStyle = isInside ? '#00E5FF' : '#757575';
                        this.ctx.fill();
                        this.ctx.strokeStyle = '#000000';
                        this.ctx.lineWidth = 1;
                        this.ctx.stroke();
                    });
                }
            }
        }

        // Draw continuous geometric edge overlay line
        this.ctx.strokeStyle = '#FFD54F';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([4, 4]);
        this.ctx.beginPath();
        const startX = 0;
        const startY = centerY + m * (0 - centerX);
        const endX = width;
        const endY = centerY + m * (width - centerX);
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
        this.ctx.setLineDash([]); // Reset line dash

        // Update stats HUD inside text
        const ratio = ((activeSubsamples / totalSubsamples) * 100).toFixed(1);
        const statsElem = document.getElementById('msaa-coverage-stat');
        if (statsElem) {
            statsElem.textContent = `Submuestras dentro: ${activeSubsamples}/${totalSubsamples} (${ratio}%)`;
        }
    }
}
