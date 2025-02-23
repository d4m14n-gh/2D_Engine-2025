import { Vector } from "./Vector";

export class Transform {
    public position: Vector;
    public rotation: number;
    public scale: Vector;

    constructor(positon = new Vector(0, 0), rotation = 0, scale = Vector.one()) {
        this.position = positon;
        this.rotation = rotation;
        this.scale = scale;
    }

    public static fromPosition(position: Vector): Transform {
        let transform: Transform = new Transform();
        transform.position = position;
        return transform;
    }

    public clone(): Transform{
        let ret = new Transform();
        ret.position=this.position.clone();
        ret.scale=this.scale.clone();
        ret.rotation=this.rotation;
        return ret;
    }
}