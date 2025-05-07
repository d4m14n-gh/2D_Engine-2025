"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rgb = void 0;
class rgb {
    r = 0;
    g = 0;
    b = 0;
    a = 1;
    static stroke = new rgb(43, 43, 44);
    // public static readonly background: rgb = new rgb(91, 93, 98);
    static background = new rgb(93, 97, 95);
    constructor(r, g, b, a = 1) {
        this.r = Math.min(255, Math.max(0, r));
        this.g = Math.min(255, Math.max(0, g));
        this.b = Math.min(255, Math.max(0, b));
        this.a = Math.min(1, Math.max(0, a));
    }
    toString() {
        return `rgba(${this.r},${this.g},${this.b},${Math.max(0, Math.min(this.a, 1))})`;
    }
    toRgb() {
        return new rgb(this.r, this.g, this.b);
    }
    toArgb(alpha) {
        return new rgb(this.r, this.g, this.b, alpha);
    }
    blend(color, alpha) {
        return new rgb(this.r * (1 - alpha) + color.r * alpha, this.g * (1 - alpha) + color.g * alpha, this.b * (1 - alpha) + color.b * alpha);
    }
    static randomColor() {
        return new rgb(Math.random() * 255, Math.random() * 255, Math.random() * 255);
    }
    static hslToRgb(h, s, l) {
        s /= 100;
        l /= 100;
        const k = (n) => (n + h / 30) % 12;
        const a = s * Math.min(l, 1 - l);
        const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
        const r = Math.round(f(0) * 255);
        const g = Math.round(f(8) * 255);
        const b = Math.round(f(4) * 255);
        return new rgb(r, g, b);
    }
    static randomColor2() {
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 30) + 15;
        const lightness = Math.floor(Math.random() * 15) + 30;
        return rgb.hslToRgb(hue, saturation, lightness);
    }
    static getHeatmapColor(value) {
        value = Math.max(0, Math.min(1, value));
        let g = Math.min(255, Math.max(0, Math.floor(255 * value * 2)));
        let r = Math.min(255, Math.max(0, Math.floor(255 * (2 - value * 2))));
        return new rgb(r / 1.5, g / 1.5, 0, 255);
    }
    clone() {
        return new rgb(this.r, this.g, this.b, this.a);
    }
}
exports.rgb = rgb;
