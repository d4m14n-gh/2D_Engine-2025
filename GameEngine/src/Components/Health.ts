import { Component } from "../Component";
import { GameObject } from "../GameObject";
import { ICollision } from "../Plugins/CollisionDetection";
import { AnimationC } from "./Animation";
import { ColliderC } from "./Collider";
import { RigidBodyC } from "./RigidBody";
import { PolygonRendererC } from "./Renderers/PolygonRenderer";
import { GMath } from "../Helpers/Math";

export interface IDamage{
    onDamage(other: GameObject): void;
}

export class HealthC extends Component implements ICollision{
    private health: number;
    public maxHealth: number;

    constructor(maxHealth: number, health=maxHealth){
        super();
        this.health = health;
        this.maxHealth = maxHealth;
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
        this.damage(otherGO);
        
    }
    onCollisionExit(other: ColliderC): void {
    }

    public getHealth(): number {
        return this.health/this.maxHealth;
    }
    public heal(value: number): void {
        this.health = Math.min(this.maxHealth, this.health+value);
    }

    public damage(otherGameObject: GameObject){
        let damageValue = 0;
        try{
            const other = otherGameObject.getComponent(HealthC);
            damageValue = Math.min(other.health, this.health);
            if (damageValue==0)
                return;
            if (other.health>this.health){
                other.health -= this.health;
                this.health = 0;
                try{
                    other.getComponent(AnimationC).startZoom();
                }catch {}
            }
            else if (other.health<this.health){
                this.health -= other.health;
                other.health = 0;
                try{
                    this.getComponent(AnimationC).startZoom();
                }catch {}
            }
            else{
                this.health = 0;
                other.health = 0;
            }
            
            if(this.health==0){
                this.getComponent(ColliderC).enable(false);
                this.getComponent(RigidBodyC).drag=0.8;
                try{
                    this.getComponent(AnimationC).startShrink();
                }catch {}
            }
            if(other.health==0){
                other.getComponent(ColliderC).enable(false);
                other.getComponent(RigidBodyC).drag=0.8;
                try{
                    other.getComponent(AnimationC).startShrink();
                }catch {}
            }
            
            otherGameObject.getAllComponents().filter(c => "onDamage" in c)
            .forEach(c=> {try{(c as unknown as IDamage).onDamage(this.getGameObject())}catch{}});
            this.getAllComponents().filter(c => "onDamage" in c)
            .forEach(c=> {try{(c as unknown as IDamage).onDamage(otherGameObject)}catch{}});
            
        }
        catch {console.log("error")}
        return damageValue;
    }
} 