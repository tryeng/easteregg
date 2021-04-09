class EasterEggTexture {
    constructor(textures) {
        this.eggy = [0.8, 0.8, 0.95];
        this.textures = textures;
    }

    get_texel(pos) {
        var texel = false;
        for (var i = 0; i < this.textures.length; i++) {
            texel = this.textures[i].get_texel(pos) || texel;
        }

        return texel || this.eggy;
    }
}

class Stripe {
    constructor(center, width, color) {
        this.center = center;
        this.width = width;
        this.color = color;
    }

    get_texel(pos) {
        if (Math.abs(pos[1] - this.center) < this.width / 2) {
            return this.color;
        }
        else return false;
    }
}

class Pixels {
    constructor(center, width, pixels_per_circumference, x_res, y_res, spacing, x_offset, pixels) {
        this.center = center;
        this.width = width;
        this.ppc = pixels_per_circumference;
        this.x_res = x_res;
        this.y_res = y_res;
        this.spacing = spacing;
        this.x_offset = x_offset;
        this.pixels = pixels;
    }

    get_texel(pos) {
        var y = (pos[1] - this.center + this.width / 2) / this.width * this.y_res;
        var x = (pos[0] + this.x_offset) * this.ppc % this.ppc;
        var distance_from_edge = Math.min(Math.abs(y - Math.round(y)), Math.abs(x - Math.round(x)));
        var y = this.y_res - Math.floor((pos[1] - this.center + this.width / 2) / this.width * this.y_res) - 1;
        var x = Math.floor(x);
        if (0 <= y && y < this.y_res && x < this.x_res && distance_from_edge > this.spacing) {
            return this.pixels[y * this.x_res + x];
        }
        else return false;
    }
}

class DoubleSine {
    constructor(center, width, freq, offset, amplitude, color) {
        this.center = center;
        this.width = width;
        this.freq = freq;
        this.offset = offset
        this.amplitude = amplitude;
        this.color = color;
    }

    get_texel(pos) {
        if (Math.abs(pos[1] - this.center) < (this.width / 2) + Math.cos(pos[0] * Math.PI * 2 * this.freq) * this.amplitude / 2 ) {
            return this.color;
        }
        else return false;
    }
}

class Sine {
    constructor(center, width, freq, offset, amplitude, color) {
        this.center = center;
        this.width = width;
        this.freq = freq;
        this.offset = offset;
        this.amplitude = amplitude;
        this.color = color;
    }

    get_texel(pos) {
        var cos = Math.cos((pos[0] * this.freq +this.offset) * Math.PI * 2);
        if (Math.abs(pos[1] - this.center + cos * this.amplitude / 2) < (this.width / 2) ) {
            return this.color;
        }
        else return false;
    }
}

class DoubleSinePow {
    constructor(center, width, freq, offset, amplitude, pow, color) {
        this.center = center;
        this.width = width;
        this.freq = freq;
        this.offset = offset
        this.amplitude = amplitude;
        this.pow = pow;
        this.color = color;
    }

    get_texel(pos) {
        var cos = Math.cos((pos[0] + offset) * Math.PI * 2 * this.freq);
        if (Math.abs(pos[1] - this.center) < (this.width / 2) + Math.pow(Math.abs(cos), this.pow) * (Math.abs(cos)/cos) * this.amplitude / 2 ) {
            return this.color;
        }
        else return false;
    }
}

function DoubleSineAndStripes(color1, color2, color3, color4) {
    return new EasterEggTexture([
        new Stripe(0.5, 0.01, color1),
        new Stripe(0.475, 0.01, color1),
        new Stripe(0.45, 0.01, color1),
        new Stripe(0.3, 0.01, color1),
        new Stripe(0.325, 0.01, color1),
        new Stripe(0.35, 0.01, color1),
        new Stripe(0.4, 0.1, color2),
        new DoubleSine(0.4, 0.03, 10, 0, 0.02, color3),
        new DoubleSine(0.4, 0.02, 10, 0, 0.02, color4),
    ]);
}

function CrochetSock(color1) {
    var stripes = [];
    for (i = 0; i < 10; i++) {
        stripes.push(new Sine(0.40, 0.01, 2, 1.0 / 10 * i, 0.25, color1));
    }
    return new EasterEggTexture(stripes);
}