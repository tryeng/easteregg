class Ray {
    constructor(origin, direction) {
        this.origin = vec3_add(origin, vec3_scale(direction, 0.000000001));
        this.direction = vec3_normalize(direction)
    }
    
    hits(scene) {
        var closest = false;
        for (var i = 0; i < scene.geometry.length; i++) {
            var intersection = scene.geometry[i].intersects(this)
            if (intersection && (!closest || intersection.distance < closest.distance)) {
                closest = intersection;
            }
        }
        return closest;
    }

    render(scene) {
        var intersection = this.hits(scene);
        if (intersection) {
            var color = [0, 0, 0];
            for (var i = 0; i < scene.lights.length; i++) {
                var light = scene.lights[i];
                if (light instanceof AmbientLight) {
                    color = vec3_add(color, vec3_mul(intersection.tex_color, light.color));
                }
                if (light instanceof DirectionalLight) {
                    if (!(new Ray(intersection.position, vec3_neg(light.direction))).hits(scene)) {
                        var cos_light_angle = vec3_dotp(vec3_neg(light.direction), intersection.normal);
                        if (cos_light_angle < 0) cos_light_angle = 0;
                        //console.log(cos_light_angle);
                        color = vec3_add(color, vec3_mul(intersection.tex_color, vec3_scale(light.color, cos_light_angle)));
                        //console.log("test");
                    }
                }
                if (light instanceof PointLight) {
                }
            }
            var pixel = [color[0], color[1], color[2], 1];
        }
        else { // Ray did't hit anything. Return alpha 0
            var pixel = [0, 0, 0, 0];
        }
        return pixel;
    }
}

class AmbientLight {
    constructor(color) {
        this.color = color;
    }
}

class PointLight {
    constructor(position, color) {
        this.position = position;
        this.color = color;
    }
}

class DirectionalLight {
    constructor(direction, color) {
        this.direction = vec3_normalize(direction);
        this.color = color;
    }
}

class Intersection {
    constructor(position, normal, tex_coord, tex_color, distance, ray, object) {
        this.position = position;
        this.normal = normal;
        this.tex_coord = tex_coord;
        this.tex_color = tex_color;
        this.distance = distance;
        this.ray = ray;
        this.object = object;
    }
}

class Egg {
    constructor(center, radius, top_stretch, texture) {
        this.center = center;
        this.radius = radius;
        this.top_stretch = top_stretch;
        this.texture = texture;
        this.egg_height = this.radius + this.radius * this.top_stretch;
    }
    move_scale(v, s) {
        return [v[0], this.center[1] + (v[1] - this.center[1]) * s, v[2]];
    }
    scale(v, s) {
        return [v[0], v[1] * s, v[2]];
    }
    intersects(ray) {
        var o_c = vec3_sub(ray.origin, this.center);
        var o_c_len = vec3_len(o_c);
        var a = vec3_dotp(ray.direction, o_c);
        var b = a*a;
        var c = o_c_len * o_c_len - this.radius * this.radius;
        var sq = b - c;
        var behind_camera = false;
        if (sq >= 0) {
            var d = -a - Math.sqrt(sq);
            if (d < 0) {
                d = -a + Math.sqrt(sq);
                if (d <= 0) {
                    behind_camera = true;
                }
            }
            var position = vec3_add(ray.origin, vec3_scale(ray.direction, d));
            var normal = vec3_normalize(vec3_sub(position, this.center));
            var tex_x = Math.acos(vec3_dotp(vec3_normalize([normal[0], 0, normal[2]]), [0, 0, -1]));
            if (normal[0] < 0) tex_x *= -1;
            tex_x = (tex_x + Math.PI) / (Math.PI*2);
            var tex_coord = [tex_x, (position[1] + this.radius - this.center[1]) / this.egg_height];
            var tex_color = this.texture.get_pixel(tex_coord);
            if (position[1] - this.center[1] <= 0 && !behind_camera) {
                return new Intersection(position, normal, tex_coord, tex_color, d, ray, this);
            }
        }
        // The ray did not intersect the bottom half of this egg, lets try the top half.
        return this.intersects_top(ray);
    }

    intersects_top(iray) {
        var origin = this.move_scale(iray.origin, 1 / this.top_stretch);
        var direction = this.scale(iray.direction, 1 / this.top_stretch);
        var ray = new Ray(origin, direction);
        var o_c = vec3_sub(ray.origin, this.center);
        var o_c_len = vec3_len(o_c);
        var a = vec3_dotp(ray.direction, o_c);
        var b = a*a;
        var c = o_c_len * o_c_len - this.radius * this.radius;
        var sq = b - c;
        if (sq >= 0) {
            var d = -a - Math.sqrt(sq);
            if (d < 0) {
                d = -a + Math.sqrt(sq);
                if (d <= 0) {
                    return false;
                }
            }
            var position = this.move_scale(vec3_add(ray.origin, vec3_scale(ray.direction, d)), this.top_stretch);
            var normal = vec3_normalize(this.scale(vec3_sub(position, this.center), this.top_stretch));
            var tex_x = Math.acos(vec3_dotp(vec3_normalize([normal[0], 0, normal[2]]), [0, 0, -1]));
            if (normal[0] < 0) tex_x *= -1;
            tex_x = (tex_x + Math.PI) / (Math.PI*2);
            var tex_y = (position[1] - this.center[1] + this.radius) / this.egg_height;
            var tex_coord = [tex_x, tex_y];
            var tex_color = this.texture.get_pixel(tex_coord);
            if (position[1] - this.center[1] > 0) {
                return new Intersection(position, normal, tex_coord, tex_color, d, ray, this);
            }
        }
        return false;
    }
}

class Scene {
    constructor(geometry, lights) {
        this.geometry = geometry;
        this.lights = lights;
    }
}

class Camera {
    constructor(width, height, focal_length) {
        this.width = width;
        this.height = height;
        this.focal_point = [0, 30, -focal_length];
    }
    render(res_x, res_y, aa_res, scene) {
        res_x *= aa_res;
        res_y *= aa_res;
        var data = new Uint8ClampedArray(res_x * res_y * 4);
        console.log(this.width, this.height);
        for (var y = 0; y <= res_y; y++) {
            for (var x = 0; x <= res_x; x++) {
                var vp_point = [(-this.width / 2) + this.width / res_x * (x + 0.5),
                                (this.height / 2) - this.height / res_y * (y + 0.5),
                                0]
                var ray = new Ray(vp_point, vec3_normalize(vec3_sub(vp_point, this.focal_point)));
                var pixel = ray.render(scene);
                if (pixel > 1) {
                    pixel = 1.0
                }
                for (var i = 0; i < 4; i++) {
                    data[(y * res_x + x) * 4 + i] = pixel[i] * 255;
                }
            }
        }

        console.log("Antialiasing...");

        res_x /= aa_res;
        res_y /= aa_res;
        var aa_data = new Uint8ClampedArray(res_x * res_y * 4);
        for (var y = 0; y <= res_y; y++) {
            for (var x = 0; x <= res_x; x++) {
                for (var i = 0; i < 4; i++) {
                    var aa = [0, 0, 0, 0];
                }
                var n_opaque = 0;
                for (var a = 0; a < aa_res; a++) {
                    for (var b = 0; b < aa_res; b++) {
                        var opaque = data[((y * aa_res + a) * res_x * aa_res + x * aa_res + b) * 4 + 3] > 0;
                        if (opaque) {
                            n_opaque++;
                            for (var i = 0; i < 4; i++) {
                                aa[i] += data[((y * aa_res + a) * res_x * aa_res + x * aa_res + b) * 4 + i];
                            }
                        }
                    }
                }
                for (var i = 0; i < 3; i++) {
                    aa_data[(y * res_x + x) * 4 + i] = aa[i] / n_opaque;
                }
                aa_data[(y * res_x + x) * 4 + 3] = n_opaque / (aa_res * aa_res - 1) * 255;
            }
        }
        console.log("Done!");
        return new ImageData(aa_data, res_x, res_y);
    }
}