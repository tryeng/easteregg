class EasterEggTexture {
    constructor(freq, color1, color2) {
        this.freq = freq;
        this.color1 = color1;
        this.color2 = color2;
    }
    get_pixel(pos) {
        if (pos[1] > 0.35 && pos[1] < 0.40) {
            if ((pos[0] * 100 - 2.5) % 10 < 5) {
                return [0.8, 0.8, 0.95];
            }
            else {
                return this.color1;
            }
        }
        if ((pos[1] > 0.42 && pos[1] < 0.48)) {
            if ((pos[0] * 100 - 2.5) % 10 > 5) {
                return [0.8, 0.8, 0.95];
            }
            else {
                return this.color2;
            }
        }
        if (pos[1] > 0.50 && pos[1] < 0.60) {
                if ((pos[0] * 100 - 6) % 10 < 1) {
                    return [0.8, 0.8, 0.95];
                }
                else {
                    return this.color1;
                }
            }
        if ((pos[1] > 0.62 && pos[1] < 0.68)) {
            if ((pos[0] * 100 - 2.5) % 10 > 5) {
                return [0.8, 0.8, 0.95];
            }
            else {
                return this.color2;
            }
        }
        if ((pos[1] > 0.70 && pos[1] < 0.75)) {
            if ((pos[0] * 100 - 2.5) % 10 < 5) {
                return [0.8, 0.8, 0.95];
            }
            else {
                return this.color1;
            }
        }
        else return [0.8, 0.8, 0.95];
    }
}