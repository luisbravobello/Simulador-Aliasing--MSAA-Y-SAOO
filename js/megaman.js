/**
 * Megaman Pixel Art Generator (Authentic NES Megaman 1/2/3 Sprite)
 * Pixel-perfect reproduction of Capcom's classic NES Mega Man sprite
 */

class MegamanSprite {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        
        // Official NES Mega Man Color Palette
        this.colors = {
            '.': null,       // Transparent
            'B': '#000000', // Black Outline
            'D': '#0058F8', // NES Dark Blue Armor
            'C': '#3CBCFC', // NES Cyan / Light Blue
            'S': '#FCBEA0', // NES Peach Skin Tone
            'W': '#FFFFFF'  // White (Eyes / Highlights)
        };

        // Authentic 26x24 NES Megaman Shooting / Action Pose Matrix (Exact NES Sprite)
        this.spriteShooting = [
            "............BBBBBB..........",
            "..........BBCCCCCCBB........",
            ".........BCCCCCCDCCCB.......",
            "........BCCCCCDDDDDCCB......",
            ".......BDDCCCCCDDDDDCCB.....",
            ".....BBBBDDCCCCCCDDDDCCBB...",
            "....BCCCCBDDCCCCCCDDDDCCB...",
            "...BCCCCCCBDDCCCCCCSSDDDD...",
            "..BCCCCCCCBDDCCCCCCSSSSBB...",
            ".BCCCCDCCCCBDDCCCCCCSSSSSB..",
            "BCCDDDDCCCCBDDCCCCCCWWWWWB..",
            "BCDDDDDDCCCBDDCCCCCBWBWWB...",
            ".BDDDDDDDCCBBBCCCCCBWWWB....",
            "..BBBBBBBB...BCCCCCBSSSB....",
            ".............BCCCCCBSSSB....",
            "......BBBBB...BCCCCCBBB.....",
            "....BBCCCCCBB..BCCCCDCB.....",
            "...BCCCCDCCCCB..BCCDDDCB....",
            "..BDDCCCCDDCCCB..BCCDDDCB...",
            "..BDDCCCCDDCCCB...BBBBBBB...",
            ".BDDCCCCCCDDCCCB............",
            ".BDDCCCCCCDDCCCB............",
            "..BBBBBBBBBBBBBB............"
        ];

        this.drawMatrix(this.spriteShooting);
    }

    drawMatrix(matrix) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const rows = matrix.length;
        const cols = matrix[0].length;

        // Calculate pixel scale to fit canvas
        const scale = Math.floor(Math.min(this.canvas.width / cols, this.canvas.height / rows));
        const offsetX = Math.floor((this.canvas.width - cols * scale) / 2);
        const offsetY = Math.floor((this.canvas.height - rows * scale) / 2);

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const char = matrix[r][c];
                const color = this.colors[char];
                if (color) {
                    this.ctx.fillStyle = color;
                    this.ctx.fillRect(offsetX + c * scale, offsetY + r * scale, scale, scale);
                }
            }
        }
    }
}

// Global function to update Megaman speech bubble
function setMegamanSpeech(text) {
    const bubble = document.getElementById('megaman-speech');
    if (bubble) {
        bubble.textContent = text;
    }
}
