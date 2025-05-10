import { Component } from "../Core/Component";
import { GameObject } from "../Core/GameObject";
import { Vector } from "../Helpers/Vector";
import { PlayerPlugin } from "../Plugins/Player";
import { CanonC } from "./Canon";
import { StandaloneComponent } from "./StandaloneComponent";
import { BulletC } from "./Bullet";
import { RigidBodyC } from "./RigidBody";
import { GMath } from "../Helpers/Math";
import { DamageEventArgs, HealthC } from "./Health";
import { EventArgs} from "../Core/GameEvent";


export enum NpcType{
    neutral,
    passive,
    aggresive
}
export class NpcC extends StandaloneComponent{
    public type: NpcType = NpcType.aggresive;
    public isAttacing: boolean = false;
    private targetId: string = "None";
    isFollowing: boolean = false;
    minDistance: number = 35;
    maxDistance: number = 1000;
    maxSpeed: number = 10;

   
    protected override start(): void {
        let health = this.getComponent(HealthC);
        health.damageEvent.subscribe(this);
    }
    protected override event(args: EventArgs): void {
        let damageArgs = args as DamageEventArgs;
        const other = damageArgs.participant;
        if(other.hasComponent(BulletC) && other.getComponent(BulletC).getOwner())
            this.attack(other.getComponent(BulletC).getOwner()!);
    }


    private attack(gameObject: GameObject): void{
        this.isAttacing = true;
        this.targetId = gameObject.getId();
        this.isFollowing = true;
    }
    override update(delta: number): void {
        let target = this.getGameWorld().getGameObject(this.targetId);
        
        if (!target){
            this.isAttacing=false;
            return;
        } 
        
        if(this.isAttacing){
            let turret = this.getComponent(CanonC);
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