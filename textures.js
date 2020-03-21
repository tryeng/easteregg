class EasterEggTexture {
    constructor(freq, color1) {
        this.freq = freq;
        this.color1 = color1;
    }
    get_pixel(pos) {
        if (pos[1] > 0.35 && pos[1] < 0.75 && pos[1] * 100 % 8 < 8) return this.color1;
        else return [0.8, 0.8, 0.95];
    }
}