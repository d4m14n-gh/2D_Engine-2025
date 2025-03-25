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
import { EventArgs, EventSubsKey, Subscriber } from "../Core/GameEvent";


export enum NpcType{
    neutral,
    passive,
    aggresive
}
export class NpcC extends StandaloneComponent{
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

    override onEvent(key: EventSubsKey, args: EventArgs): void {
        if (key.equals(this.damageKey)){

            let damageArgs = args as DamageEventArgs;
            const other = damageArgs.participant;
            if(other.hasComponent(BulletC) && other.getComponent(BulletC).getOwner())
                this.attack(other.getComponent(BulletC).getOwner()!);
        }
    }

    private attack(gameObject: GameObject): void{
        this.isAttacing = true;
        this.target = new WeakRef(gameObject);
        this.isFollowing = true;
    }

    private damageKey!: EventSubsKey;
    protected override start(): void {
        let health = this.getComponent(HealthC);
        this.damageKey = health.damageEvent.subscribe(this);
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