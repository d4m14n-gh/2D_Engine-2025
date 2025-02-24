import { Component } from "../Component";
import { GameObject } from "../GameObject";
import { GameObjectFactory } from "../GameObjectFactory";
import { Vector } from "../Helpers/Vector";
import { ConfigPlugin } from "../Plugins/Config";
import { ColliderC } from "./Collider";
import { PolygonRendererC } from "./Renderers/PolygonRenderer";
import { RigidBodyC } from "./RigidBody";

export class CanonC extends Component {
    public cooldown: number = 0.1;
    public bulletSpeed: number = 25;
    public bulletSpraed: number = 0.1;
    public offset: Vector = new Vector(2.5, 0);
    public direction: Vector = Vector.right();
    private lastShootTime: number = -10;

    constructor(){
        super();
    }

    public getShotDelta(): number{
        let totalTime = this.gameObject.gameWorld.getTotal();
        return totalTime-this.lastShootTime;
    }

    public shoot(): void{
        if(!this.enabled||!this.gameObject.enabled)
            return;
        if(this.getShotDelta()>=this.cooldown){
            const sW = 0.125;
            let bullet = GameObjectFactory.bulletGO((ConfigPlugin.get("bulletSize")??0.65)+(Math.random()*2-1)*sW);
            
            let rigidBody = bullet.getComponent<RigidBodyC>(RigidBodyC.name);
            let collider = bullet.getComponent<ColliderC>(ColliderC.name);
            let renderer = bullet.getComponent<PolygonRendererC>(PolygonRendererC.name);
            renderer.color = this.gameObject.getComponent<PolygonRendererC>(PolygonRendererC.name).color.clone();

            collider.avoid = other => other.gameObject === this.gameObject;
            
            const offset = this.direction.toUnit().times(this.offset.x).add(this.direction.cross().times(this.offset.y));
            bullet.transform.position = this.gameObject.transform.position.add(offset);

            let spread = this.direction.cross().times(Math.random()*2*this.bulletSpraed-this.bulletSpraed);
            rigidBody.velocity = this.direction.toUnit().add(spread).times(45); 
 
            bullet.spawn(this.gameObject.gameWorld);
            this.lastShootTime=this.gameObject.gameWorld.getTotal();
        }
    }    
} 