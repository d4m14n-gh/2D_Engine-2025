"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transform = void 0;
const Vector_1 = require("./Vector");
class Transform {
    position;
    rotation;
    scale;
    constructor(positon = new Vector_1.Vector(0, 0), rotation = 0, scale = Vector_1.Vector.one()) {
        this.position = positon;
        this.rotation = rotation;
        this.scale = scale;
    }
    static fromPosition(position) {
        let transform = new Transform();
        transform.position = position;
        return transform;
    }
    clone() {
        let ret = new Transform();
        ret.position = this.position.clone();
        ret.scale = this.scale.clone();
        ret.rotation = this.rotation;
        return ret;
    }
}
exports.Transform = Transform;
