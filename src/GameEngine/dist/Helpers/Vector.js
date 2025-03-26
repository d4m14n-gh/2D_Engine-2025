import { GMath } from "./Math";
export class Vector {
    x = 0;
    y = 0;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    //standard operators
    add(a) {
        return new Vector(this.x + a.x, this.y + a.y);
    }
    sub(a) {
        return new Vector(this.x - a.x, this.y - a.y);
    }
    times(a) {
        return new Vector(this.x * a, this.y * a);
    }
    //other operators 
    distance(other) {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
    }
    static distance(a, b) {
        return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
    }
    magnitude() {
        return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }
    cross() {
        return new Vector(this.y, -this.x).toUnit();
    }
    scalarProduct(v) {
        return this.x * v.x + this.y * v.y;
    }
    vectorProduct(v) {
        return this.x * v.y - this.y * v.x;
    }
    perpendicular(n) {
        return this.sub(n.cross().times((n.scalarProduct(this)) / (n.magnitude() * n.magnitude())));
    }
    toUnit() {
        if (this.magnitude() != 0)
            return new Vector(this.x, this.y).times(1 / this.magnitude());
        else
            return new Vector(1, 0);
    }
    setLength(length) {
        return this.toUnit().times(length);
    }
    toString() {
        return "{" + this.x + ":" + this.y + "}";
    }
    toRad() {
        return Math.atan2(this.y, this.x); // Kąt w radianach
    }
    reverse() {
        let sx = 1e32;
        let sy = 1e32;
        if (this.x != 0)
            sx = 1 / this.x;
        if (this.y != 0)
            sy = 1 / this.y;
        return new Vector(sx, sy);
    }
    static fromRad(rad) {
        return new Vector(Math.cos(rad), Math.sin(rad));
    }
    static randomPos(range) {
        return new Vector(GMath.symRand(range), GMath.symRand(range));
    }
    static randomPos2(range) {
        let angle = GMath.symRand(Math.PI);
        let distance = Math.random() * range;
        return Vector.fromRad(angle).times(distance);
    }
    clone() {
        return new Vector(this.x, this.y);
    }
    //consts
    static zero() { return new Vector(0, 0); }
    static one() { return new Vector(1, 1); }
    static up() { return new Vector(0, 1); }
    static down() { return new Vector(0, -1); }
    static left() { return new Vector(-1, 0); }
    static right() { return new Vector(1, 0); }
}
