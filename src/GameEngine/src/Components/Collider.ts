import { Component } from "../Component";
import { GameObject } from "../GameObject";
import { Vector } from "../Helpers/Vector";

export class ColliderC extends Component {
    public offset: Vector = Vector.zero();
    public radius: number;
    public isActive: boolean = false;
    public isStatic: boolean;
    // public layer: number;
    public avoidObjectes: WeakSet<GameObject>;
    public collisions: Set<ColliderC> = new Set<ColliderC>();

    constructor(radius: number = 1, isStatic: boolean = true, ...avoidObjectes: GameObject[]){
        super();
        this.radius = radius;
        this.isStatic = isStatic;
        this.avoidObjectes = new Set();
        avoidObjectes.forEach(ao => this.avoidObjectes.add(ao))
    }

    public getCenter(): Vector {
        return this.getTransform().position.add(this.offset);
    }

    public collides(other: ColliderC): boolean {
        return ( (this.getCenter())
        .sub(other.getCenter())
        .magnitude() <= this.radius+other.radius )
        && !this.avoidObjectes.has(other.getGameObject()) && !other.avoidObjectes.has(this.getGameObject());
    }
} 