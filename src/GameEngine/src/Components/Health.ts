import { Component } from "../Component";
import { GameObject } from "../GameObject";
import { AnimationC } from "./Animation";
import { ColliderC, CollisionEventArgs } from "./Collider";
import { RigidBodyC } from "./RigidBody";
import { PolygonRendererC } from "./Renderers/PolygonRenderer";
import { GMath } from "../Helpers/Math";
import { EventArgs, EventSubsKey, GameEvent, Subscriber } from "../GameEvent";

export class DamageEventArgs extends EventArgs{
    public damage: number;
    public participant: HealthC;
    constructor(damage: number, participant: HealthC){
        super();
        this.damage = damage;
        this.participant = participant;
    }
}

export class HealthC extends Component implements Subscriber{
    private health: number;
    public maxHealth: number;
    public damageEvent: GameEvent; 

    constructor(maxHealth: number, health=maxHealth){
        super();
        this.health = health;
        this.maxHealth = maxHealth;
        this.damageEvent = new GameEvent();
    }

    private collisionEnterKey!: EventSubsKey;
    protected onSpawn(): void {
        this.collisionEnterKey = this.getComponent(ColliderC).onCollisionEnterEvent.subscribe(this);
    }
    onEvent(key: EventSubsKey, args: EventArgs): void {
        if (key.equals(this.collisionEnterKey)){
            let other = (args as CollisionEventArgs).collider;
            this.onCollisionEnter(other);
        }
    }

    onCollisionEnter(other: ColliderC): void { 
        let otherGO = other.getGameObject();       
        
        
        let otherRigidbody = otherGO.getComponent(RigidBodyC);
        let thisRigidbody = this.getComponent(RigidBodyC);

        let op = thisRigidbody.mass/(otherRigidbody.mass+thisRigidbody.mass);
        if(thisRigidbody.mass<otherRigidbody.mass){
            otherRigidbody.velocity = otherRigidbody.velocity.add(thisRigidbody.velocity.times(op)); //toUnit().times(v2);
            thisRigidbody.velocity = thisRigidbody.velocity.add(otherRigidbody.velocity.times(1-op)); //toUnit().times(v2);
            
            // let otherColor = other.getComponent(PolygonRendererC).color;
            // this.getComponent(PolygonRendererC).color = otherColor.toRgb();
        }
        otherRigidbody.angularVelocity -= this.getTransform().position.sub(otherGO.getTransform().position).vectorProduct(thisRigidbody.velocity)*(op/10);
        
        try{
            const other = otherGO.getComponent(HealthC);
            const damageValue = Math.min(other.health, this.health);
            if (damageValue==0)
                return;
            this.onDamage(damageValue, other);
            other.onDamage(damageValue, this);            
        }
        catch {}
        
    }

    onCollisionExit(other: ColliderC): void {
    }

    public getHealth(): number {
        return this.health/this.maxHealth;
    }
    public heal(value: number): void {
        this.health = Math.min(this.maxHealth, this.health+value);
    }

    public onDamage(value: number, participant: HealthC): void {
        this.health -= value;
        this.damageEvent.addInvokeArgs(new DamageEventArgs(value, participant));
        this.damageEvent.invoke();
        if(this.health==0){
            this.getComponent(ColliderC).enable(false);
            this.getComponent(RigidBodyC).drag=0.8;
            try{
                this.getComponent(AnimationC).startShrink();
            }catch {}
        }
        else{
            try{
                this.getComponent(AnimationC).startZoom();
            }catch {}
        }
    }
} 