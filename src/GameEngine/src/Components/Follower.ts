import { Component } from "../Component";
import { GameObject } from "../GameObject";
import { Transform } from "../Helpers/Transform";
import { PlayerPlugin } from "../Plugins/Player";
import { RigidBodyC } from "./RigidBody";
import { StandaloneComponent } from "./StandaloneComponent";

export class FollowerC extends StandaloneComponent {
    public minDistance: number = 20;
    public maxDistance: number = 65;
    public maxSpeed: number = 10;
    public isFollowing: boolean = false;
    public target: WeakRef<GameObject>;
    
    constructor(target: GameObject){
        super();
        this.target = new WeakRef(target);
    }
    
    override update(): void {
        if (!this.isFollowing||!this.target.deref())
            return;
        
        const distance = this.gameObject.transform.position
        .distance(this.target.deref()!.transform.position);
    
        if (distance>=this.minDistance && distance<=this.maxDistance)
            this.follow();
    }

    follow(): void{
        let rigidBody = this.gameObject.getComponent<RigidBodyC>(RigidBodyC.name);
        rigidBody.velocity = this.target.deref()!.transform.position.sub(
            this.gameObject.transform.position
        ).toUnit().times(this.maxSpeed);   
    }
} 