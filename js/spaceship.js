/**
 * Retro Pixel Art Spaceship Generator
 * Pixel-perfect reproduction of the user's original reference image
 * (44x47 grid, colors extracted directly from the source PNG)
 * Includes animated engine thruster flame
 */

class SpaceshipSprite {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.frame = 0;

        // Exact color palette extracted from the original reference image
        this.colors = {
            '.': null,       // Transparent (background)
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
            'N': '#ffe208',  // Flame - yellow core
            'A': null        // Background of the source image -> transparent
        };

        // 44x47 pixel matrix, extracted pixel-by-pixel from the original image
        this.matrixFrame1 = [
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

        // Same matrix, with the thruster flame brightened/widened for a pulsing animation
        this.matrixFrame2 = [
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
            "AAAAAABHJBEEFBAAAAAAMNNNNMAAAAAABFEEBJHBAAAA",
            "AAAAAABHJBEFBAAAAAAAMNNNNMAAAAAAABFEBJHBAAAA",
            "AAAAAABHJBFBAAAAAAAAAMNNMAAAAAAAAABFBJHBAAAA",
            "AAAAAABHJBBAAAAAAAAAAMNNMAAAAAAAAAABBJHBAAAA",
            "AAAAAABHJBAAAAAAAAAAANMMNAAAAAAAAAAABJHBAAAA",
            "AAAAAABHBAAAAAAAAAAAAAAAAAAAAAAAAAAAABHBAAAA",
            "AAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAA",
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
            "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
        ];

        this.startAnim();
    }

    drawMatrix(matrix) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const rows = matrix.length;
        const cols = matrix[0].length;

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

    startAnim() {
        const loop = () => {
            this.frame += 0.08;
            const matrix = (Math.floor(this.frame) % 2 === 0) ? this.matrixFrame1 : this.matrixFrame2;
            this.drawMatrix(matrix);
            requestAnimationFrame(loop);
        };
        loop();
    }
}

// Global function to update Spaceship Pilot speech bubble
function setSpaceshipSpeech(text) {
    const bubble = document.getElementById('spaceship-speech');
    if (bubble) {
        bubble.textContent = text;
    }
}