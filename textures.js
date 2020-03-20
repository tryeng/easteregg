class EasterEggTexture {
    constructor() {
    }
    get_pixel(pos) {
        if (pos[1] > 0.3 && pos[1] < 0.7 && pos[1] * 100 % 8 < 3) return [0.5, 0.8, 0.5];
        else return [0.78, 0.78, 0.95];
    }
}