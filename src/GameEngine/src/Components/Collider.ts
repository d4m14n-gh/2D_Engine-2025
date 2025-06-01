import { Component } from "../Core/Component";
import * as rp from "@dimforge/rapier2d";
import { EventArgs, GameEvent } from "../Core/GameEvent";
import { GameObject } from "../Core/GameObject";
import { Vector } from "../Helpers/Vector";
import { PhysicsPlugin } from "../Plugins/Physics";
import { RigidBodyC } from "./RigidBody";

export class CollisionEventArgs extends EventArgs{
    public collider: ColliderC;
    constructor(collider: ColliderC) {
        super();
        this.collider = collider;
    }
}

export class ColliderC extends Component {
    public offset: Vector = new Vector(0, 0);
    public onCollisionEnterEvent: GameEvent = new GameEvent(); 
    public onCollisionExitEvent: GameEvent = new GameEvent(); 

    private colliderDesc: rp.ColliderDesc;
    private collider: rp.Collider | undefined;
    
    constructor(radius: number = 1, isStatic: boolean = true, ...avoidObjectes: GameObject[]){
        super();
        this.colliderDesc = rp.ColliderDesc.ball(radius);
    }
    
    override start(): void {
        this.onCollisionEnterEvent.register(this.getGameWorld());
        this.onCollisionExitEvent.register(this.getGameWorld());
    }
    
    override spawn(): void {
        console.log("ColliderC spawned");
        // this.colliderDesc.setTranslation(this.offset.x, this.offset.y);
        // this.colliderDesc.setSensor(true);
        // this.colliderDesc.setCollisionGroups(0x0001);
        // this.colliderDesc.setActiveEvents(true);
        this.colliderDesc.setMass(0.25);
        // this.colliderDesc.setDensity(1);
        // this.colliderDesc.setRestitution(0.5);
        // this.colliderDesc.setFriction(0.5);
        this.collider = this.getPlugin(PhysicsPlugin)!.getWorld().createCollider(this.colliderDesc, this.getComponent(RigidBodyC)!.getRigidBody());
    }

    public getRadius(): number {
        if (this.collider?.shape instanceof rp.Ball)
            return this.collider.shape.radius;
        return 0;
    }

    public onCollisionEnter(other: ColliderC): void{
        this.onCollisionEnterEvent.emit(new CollisionEventArgs(other));
    }

    public onCollisionExit(other: ColliderC): void{
        this.onCollisionExitEvent.emit(new CollisionEventArgs(other));
    }
}