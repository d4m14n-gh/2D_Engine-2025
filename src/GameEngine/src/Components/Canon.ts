// import { GMath } from "../Helpers/Math";
// import { Vector } from "../Helpers/Vector";
// import { BulletC } from "./Bullet";
// import { ColliderC } from "./Collider";
// import { CanonRendererC } from "./Renderers/CanonRenderer";
// import { PolygonRendererC } from "./Renderers/PolygonRenderer";
// import { RigidBodyC } from "./RigidBody";
// import { StandaloneComponent } from "./StandaloneComponent";

// export class CanonC extends StandaloneComponent {
//     public cooldown: number = 0.15;
//     public bulletSpeed: number = 40;
//     public length: number;
//     public width: number;
//     public range: number=250;
//     public bulletSpraed: number = 0.1;
    
//     public offset: Vector;
//     public direction: Vector = Vector.right();
//     public targetDirection: Vector = Vector.right();

//     private lastShootTime: number = -10;

//     constructor(length: number=4, width: number=2, private damage=10){
//         super();
//         this.length = length;
//         this.width = width;
//         this.offset = new Vector(length-width/2, 0);
//     }

//     public getShotDelta(): number{
//         let totalTime = this.getGameWorld().getWorldTime();
//         return totalTime-this.lastShootTime;
//     }

//     override update(delta: number): void {
//         let angle=this.direction.toRad();
//         let targetAngle=this.targetDirection.toRad();
//         angle += 9*delta*GMath.deltaAngle(angle, targetAngle);
//         this.direction = Vector.fromRad(angle);
//     }

//     public getBulletLifetime(): number{
//         return this.range/this.bulletSpeed;
//     }

//     public getGlobalOffset(): Vector{
//         return this.direction.toUnit().mul(this.offset.x).add(this.direction.cross().mul(this.offset.y));
//     }

//     public shoot(): void{
//         if(!this.isEnabled||!this.getGameObject().enabled)
//             return;
//         if(this.getShotDelta()>=this.cooldown){
//             const sW = 0.125;
//             const zindex = this.getComponent(CanonRendererC).zindex-0.01;
//             let bullet = BulletC.bulletGO(
//                 this.getGameObject(),
//                 this.damage,
//                 this.width/2+GMath.symRand(sW),
//                 this.getBulletLifetime(),
//                 zindex
//             );
            
//             let rigidBody = bullet.getComponent(RigidBodyC);
//             let collider = bullet.getComponent(ColliderC);
//             let renderer = bullet.getComponent(PolygonRendererC);
//             renderer.color = this.getComponent(PolygonRendererC).color.clone();

//             collider.avoidObjectes.add(this.getGameObject());
            
//             bullet.getTransform().position = this.getTransform().position.add(this.getGlobalOffset());

//             let spread = this.direction.cross().mul(Math.random()*2*this.bulletSpraed-this.bulletSpraed);
//             rigidBody.velocity = this.direction.toUnit().add(spread).mul(this.bulletSpeed);
//             // rigidBody.velocity = rigidBody.velocity .add(this.getComponent(RigidBodyC).velocity.times(0.25)); 
 
//             bullet.spawn(this.getGameWorld());
//             this.lastShootTime=this.getGameWorld().getWorldTime();
//         }
//     }    
// } 