import { Component } from "../Component";
import { GameObject } from "../GameObject";
import { Color } from "../Helpers/Color";
import { Vector } from "../Helpers/Vector";
import { ICollision } from "../Plugins/CollisionDetection";
import { AnimationC } from "./Animation";
import { BarRendererC } from "./Renderers/BarRenderer";
import { ColliderC } from "./Collider";
import { RendererC } from "./Renderers/Renderer";
import { RigidBodyC } from "./RigidBody";
import { PolygonRendererC } from "./Renderers/PolygonRenderer";

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
        let otherGO = other.gameObject;       
        this.damage(otherGO);
        
        
        let otherRigidbody = otherGO.getRigidBody();
        let thisRigidbody = this.gameObject.getRigidBody();
        otherRigidbody.velocity = otherRigidbody.velocity.add(thisRigidbody.velocity.times(1/20));
       
        otherRigidbody.angularVelocity -= this.gameObject.transform.position.sub(otherGO.transform.position).vectorProduct(thisRigidbody.velocity)/20;
        let otherColor = other.gameObject.getComponent<PolygonRendererC>(PolygonRendererC.name).color;
        this.gameObject.getComponent<PolygonRendererC>(PolygonRendererC.name).color = otherColor.toRgb();

    }
    onCollisionExit(other: ColliderC): void {
    }

    public getHealth(): number {
        return this.health/this.maxHealth;
    }
    public heal(value: number): void {
        this.health = Math.min(this.maxHealth, this.health+value);
    }
    
    public onDamage(otherGameObject: GameObject){
        otherGameObject.getAllComponents().filter(c => "onDamage" in c)
        .forEach(c=> {try{(c as unknown as IDamage).onDamage(otherGameObject)}catch{}});
    }

    public damage(otherGameObject: GameObject){
        let damageValue = 0;
        try{
            const other = otherGameObject.getComponent<HealthC>(HealthC.name);
            damageValue = Math.min(other.health, this.health);
            if (other.health>this.health){
                other.health -= this.health;
                this.health = 0;
                try{
                    other.gameObject.getComponent<AnimationC>(AnimationC.name).startZoom();
                }catch {}
            }
            else if (other.health<this.health){
                this.health -= other.health;
                other.health = 0;
                try{
                    this.gameObject.getComponent<AnimationC>(AnimationC.name).startZoom();
                }catch {}
            }
            else{
                this.health = 0;
                other.health = 0;
            }

            if(this.health==0){
                this.gameObject.getComponent<ColliderC>(ColliderC.name).enabled=false;
                this.gameObject.getRigidBody().drag=0.05;
                try{
                    this.gameObject.getComponent<AnimationC>(AnimationC.name).startShrink();
                }catch {}
            }
            if(other.health==0){
                other.gameObject.getComponent<ColliderC>(ColliderC.name).enabled=false;
                other.gameObject.getRigidBody().drag=0.05;
                try{
                    other.gameObject.getComponent<AnimationC>(AnimationC.name).startShrink();
                }catch {}
            }

            other.onDamage(this.gameObject);
        }
        catch {}
        return damageValue;
    }
} 