import { Component } from "../Component";
import { GameObject } from "../GameObject";
import { GameObjectFactory } from "../GameObjectFactory";
import { Vector } from "../Helpers/Vector";
import { ConfigPlugin } from "../Plugins/Config";
import { ColliderC } from "./Collider";
import { RigidBodyC } from "./RigidBody";

export class GunC extends Component {
    public cooldown: number = 0.15;
    public bulletSpeed: number = 25;
    public bulletSpraed: number = 0.1;
    public direction: Vector = Vector.right();
    private lastShootTime: number = -10;

    constructor(){
        super();
    }

    public shoot(): void{
        if(!this.enabled||!this.gameObject.enabled)
            return;
        let totalTime = this.gameObject.gameWorld.getTotal();
        if(totalTime-this.lastShootTime>=this.cooldown){
            const sW = 0.125;
            let bullet = GameObjectFactory.bulletGO((ConfigPlugin.get("bulletSize")??0.65)+(Math.random()*2-1)*sW);
            
            let rigidBody = bullet.getComponent<RigidBodyC>(RigidBodyC.name);
            let collider = bullet.getComponent<ColliderC>(ColliderC.name);

            collider.avoid = other => other.gameObject === this.gameObject; 
            bullet.transform.position = this.gameObject.transform.position;

            let spread = this.direction.cross().times(Math.random()*2*this.bulletSpraed-this.bulletSpraed);
            rigidBody.velocity = this.direction.toUnit().add(spread).times(45); 
 
            bullet.spawn(this.gameObject.gameWorld);
            this.lastShootTime=totalTime;
        }
    }    
} 