import { Component } from "../Component";
import { GameObject } from "../GameObject";
import { Vector } from "../Helpers/Vector";
import { PlayerPlugin } from "../Plugins/Player";
import { CanonC } from "./Canon";
import { HealthC, IDamage } from "./Health";
import { StandaloneComponent } from "./StandaloneComponent";
import { BulletC } from "./Bullet";
import { RigidBodyC } from "./RigidBody";
import { GMath } from "../Helpers/Math";


export enum NpcType{
    neutral,
    passive,
    aggresive
}
export class NpcC extends StandaloneComponent implements IDamage {
    public type: NpcType = NpcType.aggresive;
    public isAttacing: boolean = false;
    private target?: WeakRef<GameObject>;
    isFollowing: boolean = false;
    minDistance: number = 100;
    maxDistance: number = 1000;
    maxSpeed: number = 10;

    constructor(){
        super();
    }

    onDamage(other: GameObject): void {
        if(other.hasComponent(BulletC)&&other.getComponent(BulletC).getOwner())
            this.attack(other.getComponent(BulletC).getOwner()!);
        // else
        //     this.attack(other);
    }
    
    private attack(gameObject: GameObject): void{
        this.isAttacing = true;
        this.target = new WeakRef(gameObject);
        this.isFollowing = true;
    }

    override onSpawn(): void {
        
    }

    override update(delta: number): void {
        if(!this.target||!this.target.deref()){
            this.isAttacing=false;
            return;
        }
        
        if(this.isAttacing){
            let turret = this.getComponent(CanonC);
            let target = this.target.deref()!;
            let direction = target.getTransform().position.sub(this.getTransform().position);
            turret.targetDirection = direction; 
            let distance = direction.magnitude();
            if(distance>this.maxDistance)
                this.isAttacing = false;

            turret.shoot();
            if (distance>=this.minDistance){
                let angle=this.getTransform().rotation;
                let targetAngle=direction.toRad();
                angle += 5*delta*GMath.deltaAngle(angle, targetAngle);
                this.getTransform().rotation = angle;  

                let rigidBody = this.getComponent(RigidBodyC);
                rigidBody.velocity = Vector.fromRad(angle).times(this.maxSpeed);

            }
    
        }
    }
} 