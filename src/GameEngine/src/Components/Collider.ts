import { Component } from "../Core/Component";
import { EventArgs, GameEvent } from "../Core/GameEvent";
import { GameObject } from "../Core/GameObject";
import { Vector } from "../Helpers/Vector";


export interface RBushItem {
    colliderId: string;
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
}


export class CollisionEventArgs extends EventArgs{
    public collider: ColliderC;
    constructor(collider: ColliderC) {
        super();
        this.collider = collider;
    }
}

export class ColliderC extends Component {
    public offset: Vector = Vector.zero();
    public radius: number;
    public isActive: boolean = false;
    public isStatic: boolean;
    // public layer: number;
    public avoidObjectes: WeakSet<GameObject>;
    public collisions: Set<ColliderC> = new Set<ColliderC>();
    public onCollisionEnterEvent: GameEvent = new GameEvent(); 
    public onCollisionExitEvent: GameEvent = new GameEvent(); 


    constructor(radius: number = 1, isStatic: boolean = true, ...avoidObjectes: GameObject[]){
        super();
        this.radius = radius;
        this.isStatic = isStatic;
        this.avoidObjectes = new Set();
        avoidObjectes.forEach(ao => this.avoidObjectes.add(ao))
    }

    protected override start(): void {
        this.onCollisionEnterEvent.register(this.getGameWorld()!);
        this.onCollisionExitEvent.register(this.getGameWorld()!);
    }

    public getCenter(): Vector {
        return this.getTransform()!.position.add(this.offset);
    }

    public getAABB(): RBushItem { 
        const center = this.getCenter();
        return {
            colliderId: this.getGameObject()!.getId(),
            minX: center.x - this.radius,
            minY: center.y - this.radius,
            maxX: center.x + this.radius,
            maxY: center.y + this.radius
        };
    }


    public collides(other: ColliderC): boolean {
        return ( (this.getCenter())
        .sub(other.getCenter())
        .magnitude() <= this.radius+other.radius )
        && !this.avoidObjectes.has(other.getGameObject()!) && !other.avoidObjectes.has(this.getGameObject()!);
    }

    public onCollisionEnter(other: ColliderC): void{
        this.onCollisionEnterEvent.emit(new CollisionEventArgs(other));
    }

    public onCollisionExit(other: ColliderC): void{
        this.onCollisionExitEvent.emit(new CollisionEventArgs(other));
    }
}