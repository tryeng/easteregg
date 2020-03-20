function vec3_normalize(v) {
    var length = Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
    return [v[0] / length, v[1] / length, v[2] / length];
}

function vec3_add(a, b) {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function vec3_sub(a, b) {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function vec3_mul(a, b) {
    return [a[0] * b[0], a[1] * b[1], a[2] * b[2]];
}

function vec3_scale(a, s) {
    return [a[0]*s, a[1]*s, a[2]*s];
}

function vec3_dotp(a, b) {
    return a[0]*b[0] + a[1]*b[1] +  a[2]*b[2];
}

function vec3_neg(v) {
    return [-v[0], -v[1], -v[2]];
}

function vec3_len(v) {
    return Math.sqrt(v[0]*v[0] + v[1]*v[1] + v[2]*v[2]);
}