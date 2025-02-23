import { Component } from "../Component";
import { Vector } from "../Helpers/Vector";

export class ColliderC extends Component {
    public offset: Vector = Vector.zero();
    public radius: number;
    public isActive: boolean = false;
    public isStatic: boolean;
    public collisions: Set<ColliderC> = new Set<ColliderC>();
    //todo: change avoid 
    public avoid: (other: ColliderC) => boolean = () => false;
    // public onCollision: (other: ColliderC) => void = () => {};

    constructor(radius: number = 1, isStatic: boolean = true){
        super();
        this.radius = radius;
        this.isStatic = isStatic;
    }

    public getCenter(): Vector {
        return this.gameObject.transform.position.add(this.offset);
    }

    public collides(other: ColliderC): boolean {
        return ( (this.getCenter())
        .sub(other.getCenter())
        .magnitude() <= this.radius+other.radius )
        && !this.avoid(other) && !other.avoid(this);
    }
} 