class EasterEggTexture {
    constructor(freq, color1, color2) {
        this.freq = freq;
        this.color1 = color1;
        this.color2 = color2;
    }
    get_pixel(pos) {
        if (pos[1] > 0.35 && pos[1] < 0.40) {
            if ((pos[0] * 100 - 2.5) % 10 < 0) {
                return [0.8, 0.8, 0.95];
            }
            else {
                return this.color1;
            }
        }
        else if (pos[1] > 0.42 && pos[1] < 0.48) {
            if ((pos[0] * 100 - 1.5) % 10 < 7) {
                return [0.8, 0.8, 0.95];
            }
            else {
                return this.color2;
            }
        }
        else if (Math.abs(pos[1] - 0.55) < Math.cos(pos[0] * Math.PI * 20 + Math.PI) * 0.02 + 0.04) {
            return this.color1;
        }
        else if ((pos[1] > 0.62 && pos[1] < 0.68)) {
            if ((pos[0] * 100 - 1.5) % 10 < 7) {
                return [0.8, 0.8, 0.95];
            }
            else {
                return this.color2;
            }
        }
        else if ((pos[1] > 0.70 && pos[1] < 0.75)) {
            if ((pos[0] * 100 - 2.5) % 10 < 0) {
                return [0.8, 0.8, 0.95];
            }
            else {
                return this.color1;
            }
        }
        else return [0.8, 0.8, 0.95];
    }
}