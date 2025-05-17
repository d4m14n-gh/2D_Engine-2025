import { Component } from "../Core/Component";
import { PolygonRendererC } from "./Renderers/PolygonRenderer";
import { EventArgs, GameEvent} from "../Core/GameEvent";

export class DamageEventArgs extends EventArgs{
    public damage: number;
    public participant: HealthC;
    constructor(damage: number, participant: HealthC){
        super();
        this.damage = damage;
        this.participant = participant;
    }
}

export class HealthC extends Component{
    private health: number;
    public maxHealth: number;
    public damageEvent: GameEvent; 

    constructor(maxHealth: number, health=maxHealth){
        super();
        this.health = health;
        this.maxHealth = maxHealth;
        this.damageEvent = new GameEvent();
    }

    protected override start(): void {
        this.damageEvent.register(this.gameObject?.manager?.gameWorld);
        // this.getComponent(ColliderC).onCollisionEnterEvent.subscribe(this, "onCollisionEnter");
    }
    protected override event(args: EventArgs): void {
        // let cargs = args as CollisionEventArgs;
        // this.onCollisionEnter(cargs.collider);
    }

    // onCollisionEnter(other: ColliderC): void { 
    //     let otherGO = other.getGameObject();       
    //     let otherRigidbody = otherGO.getComponent(RigidBodyC);
    //     let thisRigidbody = this.getComponent(RigidBodyC);
    //     let op = thisRigidbody.mass/(otherRigidbody.mass+thisRigidbody.mass);
    //     if(thisRigidbody.mass<otherRigidbody.mass){
    //         otherRigidbody.velocity = otherRigidbody.velocity.add(thisRigidbody.velocity.times(op)).times(0.5); //toUnit().times(v2);
    //         thisRigidbody.velocity = thisRigidbody.velocity.add(otherRigidbody.velocity.times(1-op).times(0.5)); //toUnit().times(v2);
    //     }
    //     otherRigidbody.angularVelocity += this.getTransform().position.sub(otherGO.getTransform().position).vectorProduct(thisRigidbody.velocity)*(op/15);
    //     try{
    //         const other = otherGO.getComponent(HealthC);
    //         const damageValue = Math.min(other.health, this.health);
    //         if (damageValue==0)
    //             return;
    //         this.onDamage(damageValue, other);
    //         other.onDamage(damageValue, this);            
    //     }
    //     catch {}
    // }

    public getHealth(): number {
        return this.health/this.maxHealth;
    }
    public heal(value: number): void {
        this.health = Math.min(this.maxHealth, this.health+value);
    }

    public onDamage(value: number, participant: HealthC): void {
        this.health -= value;
        this.damageEvent.emit(new DamageEventArgs(value, participant));
       
        // if(this.health==0){
        //     this.getComponent(ColliderC)?.enable(false);
        //     this.getComponent(RigidBodyC).dampingFactor=0.6;
        //     this.getComponent(AnimationC)?.startShrink();
            
        //     if(participant.hasComponent(PolygonRendererC)){
        //         let myColor = this.getComponent(PolygonRendererC).color;
        //         let newColor = myColor.blend(
        //             participant.getComponent(PolygonRendererC).color.toRgb(),
        //             0.5
        //         ).toRgb();
        //         this.getComponent(PolygonRendererC).color = newColor;
        //         participant.getComponent(PolygonRendererC).color = newColor;
        //     }
        // }
        // else
        //     this.getComponent(AnimationC)?.startZoom();
    }
} 