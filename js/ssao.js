/**
 * Stage 3: SSAO Simulator Module
 * Simulates Screen-Space Ambient Occlusion depth sampling & contact shadows
 */

class SSAOSimulator {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');

        this.enableSSAO = true;
        this.radius = 15;
        this.intensity = 1.5;
        this.renderMode = 'full'; // 'full', 'occlusionOnly', 'depthMap'
        this.rotation = 0;

        this.initEventListeners();
        this.render();
    }

    initEventListeners() {
        const toggleBtn = document.getElementById('ssao-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                this.enableSSAO = !this.enableSSAO;
                toggleBtn.classList.toggle('active', this.enableSSAO);
                this.render();
            });
        }

        const radiusInput = document.getElementById('ssao-radius');
        if (radiusInput) {
            radiusInput.addEventListener('input', (e) => {
                this.radius = parseFloat(e.target.value);
                document.getElementById('ssao-radius-val').textContent = `${this.radius}px`;
                this.render();
            });
        }

        const intensityInput = document.getElementById('ssao-intensity');
        if (intensityInput) {
            intensityInput.addEventListener('input', (e) => {
                this.intensity = parseFloat(e.target.value);
                document.getElementById('ssao-intensity-val').textContent = `${this.intensity.toFixed(1)}x`;
                this.render();
            });
        }

        const modeBtns = document.querySelectorAll('.ssao-mode-btn');
        modeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                modeBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.renderMode = btn.dataset.mode;
                this.render();
            });
        });
    }

    render() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        this.ctx.clearRect(0, 0, width, height);

        // Offscreen buffers to simulate G-Buffer (Depth + Normal) and Occlusion Pass
        const offCanvas = document.createElement('canvas');
        offCanvas.width = width;
        offCanvas.height = height;
        const offCtx = offCanvas.getContext('2d');

        // Draw Base 3D Isometric Scene into offscreen canvas
        this.drawIsometricScene(offCtx, width, height);

        if (this.renderMode === 'depthMap') {
            this.drawDepthMap(this.ctx, width, height);
            return;
        }

        if (!this.enableSSAO) {
            // Draw raw scene without ambient occlusion
            this.ctx.drawImage(offCanvas, 0, 0);
            return;
        }

        // Generate SSAO Ambient Occlusion Pass
        const occCanvas = document.createElement('canvas');
        occCanvas.width = width;
        occCanvas.height = height;
        const occCtx = occCanvas.getContext('2d');

        this.generateAmbientOcclusion(occCtx, width, height);

        if (this.renderMode === 'occlusionOnly') {
            // Display purely the AO Shadow Buffer (Grayscale contact shadows)
            this.ctx.drawImage(occCanvas, 0, 0);
            return;
        }

        // Multiply Base Scene with AO Buffer
        this.ctx.drawImage(offCanvas, 0, 0);
        this.ctx.globalCompositeOperation = 'multiply';
        this.ctx.drawImage(occCanvas, 0, 0);
        this.ctx.globalCompositeOperation = 'source-over';
    }

    drawIsometricScene(ctx, width, height) {
        ctx.fillStyle = '#121212';
        ctx.fillRect(0, 0, width, height);

        ctx.save();
        ctx.translate(width / 2, height / 2 + 30);

        // Isometric projection helper
        const toIso = (x, y, z) => {
            const isoX = (x - y) * Math.cos(0.523599); // 30 deg
            const isoY = (x + y) * Math.sin(0.523599) - z;
            return { x: isoX, y: isoY };
        };

        // Draw ground / room corner walls
        this.drawIsoCube(ctx, toIso, 0, 0, -20, 160, 160, 10, '#333333', '#2b2b2b', '#212121'); // Floor
        this.drawIsoCube(ctx, toIso, -80, 0, 50, 10, 160, 120, '#555555', '#444444', '#333333'); // Left Wall
        this.drawIsoCube(ctx, toIso, 0, -80, 50, 160, 10, 120, '#666666', '#555555', '#444444'); // Back Wall

        // Draw Megaman style blocks and platforms
        this.drawIsoCube(ctx, toIso, -30, -30, 20, 40, 40, 40, '#0288D1', '#01579B', '#00E5FF'); // Cyan Box
        this.drawIsoCube(ctx, toIso, 20, 10, 30, 50, 50, 60, '#757575', '#616161', '#9E9E9E');   // Gray Platform Block
        this.drawIsoCube(ctx, toIso, -40, 20, 15, 30, 30, 30, '#FFD54F', '#FFB300', '#FFE082');   // Energy Gold Box

        ctx.restore();
    }

    drawIsoCube(ctx, toIso, x, y, z, w, h, d, topColor, leftColor, rightColor) {
        // 8 Vertices
        const p1 = toIso(x - w/2, y - h/2, z + d/2);
        const p2 = toIso(x + w/2, y - h/2, z + d/2);
        const p3 = toIso(x + w/2, y + h/2, z + d/2);
        const p4 = toIso(x - w/2, y + h/2, z + d/2);

        const p5 = toIso(x - w/2, y - h/2, z - d/2);
        const p6 = toIso(x + w/2, y - h/2, z - d/2);
        const p7 = toIso(x + w/2, y + h/2, z - d/2);
        const p8 = toIso(x - w/2, y + h/2, z - d/2);

        // Top Face
        ctx.fillStyle = topColor;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.stroke();

        // Left Face
        ctx.fillStyle = leftColor;
        ctx.beginPath();
        ctx.moveTo(p4.x, p4.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p7.x, p7.y);
        ctx.lineTo(p8.x, p8.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Right Face
        ctx.fillStyle = rightColor;
        ctx.beginPath();
        ctx.moveTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p7.x, p7.y);
        ctx.lineTo(p6.x, p6.y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    generateAmbientOcclusion(ctx, width, height) {
        // Fill default white (1.0 = no occlusion)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);

        // Simulate contact shadows around object bases and wall intersections
        ctx.save();
        ctx.translate(width / 2, height / 2 + 30);

        const rad = this.radius * 1.8;
        const alpha = Math.min(0.9, 0.3 * this.intensity);

        const addContactShadow = (x, y, radiusX, radiusY, strength) => {
            const grad = ctx.createRadialGradient(x, y, 2, x, y, radiusX);
            const str = Math.min(1.0, alpha * strength);
            grad.addColorStop(0, `rgba(0,0,0,${str})`);
            grad.addColorStop(0.5, `rgba(40,40,40,${str * 0.5})`);
            grad.addColorStop(1, 'rgba(255,255,255,0)');

            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.ellipse(x, y, radiusX, radiusY, 0, 0, Math.PI * 2);
            ctx.fill();
        };

        // Corner wall contact shadow line
        addContactShadow(-40, -40, rad * 3.5, rad * 1.5, 1.4);

        // Block 1 Shadow (Cyan box on floor)
        addContactShadow(-15, 15, rad * 2, rad * 1.2, 1.2);

        // Block 2 Shadow (Gray Platform)
        addContactShadow(30, 45, rad * 2.5, rad * 1.5, 1.5);

        // Block 3 Shadow (Gold box)
        addContactShadow(-25, 45, rad * 1.8, rad, 1.1);

        ctx.restore();
    }

    drawDepthMap(ctx, width, height) {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        // Draw grayscale depth representation
        ctx.save();
        ctx.translate(width / 2, height / 2 + 30);

        const toIso = (x, y, z) => {
            const isoX = (x - y) * Math.cos(0.523599);
            const isoY = (x + y) * Math.sin(0.523599) - z;
            return { x: isoX, y: isoY };
        };

        // Draw depth values (closer = brighter white, further = darker gray)
        this.drawIsoCube(ctx, toIso, 0, 0, -20, 160, 160, 10, '#333333', '#2b2b2b', '#212121');
        this.drawIsoCube(ctx, toIso, -80, 0, 50, 10, 160, 120, '#555555', '#444444', '#333333');
        this.drawIsoCube(ctx, toIso, 0, -80, 50, 160, 10, 120, '#666666', '#555555', '#444444');

        this.drawIsoCube(ctx, toIso, -30, -30, 20, 40, 40, 40, '#CCCCCC', '#AAAAAA', '#999999');
        this.drawIsoCube(ctx, toIso, 20, 10, 30, 50, 50, 60, '#EEEEEE', '#CCCCCC', '#B2B2B2');
        this.drawIsoCube(ctx, toIso, -40, 20, 15, 30, 30, 30, '#AAAAAA', '#888888', '#777777');

        ctx.restore();
    }
}
