import { GMath } from "../Helpers/Math";
import { Vector } from "../Helpers/Vector";
import { BulletC } from "./Bullet";
import { ColliderC } from "./Collider";
import { BulletRendererC } from "./Renderers/BulletRenderer";
import { CanonRendererC } from "./Renderers/CanonRenderer";
import { PolygonRendererC } from "./Renderers/PolygonRenderer";
import { SmokeRendererC } from "./Renderers/SmokeRenderer";
import { RigidBodyC } from "./RigidBody";
import { StandaloneComponent } from "./StandaloneComponent";

export class CanonC extends StandaloneComponent {
    public cooldown: number = 0.25;
    public bulletSpeed: number = 40;
    public length: number;
    public width: number;
    public range: number=250;
    public bulletSpraed: number = 0.05;
    
    public offset: Vector;
    public direction: Vector = Vector.right();
    public targetDirection: Vector = Vector.right();

    private shotDelta: number = 1e9;
    // private lastShootTime: number = performance.now();

    constructor(length: number=4, width: number=2, private damage=10){
        super();
        this.length = length;
        this.width = width;
        this.offset = new Vector(length-this.width, 0);
    }

    public getShotDelta(): number{
        return this.shotDelta;
    }

    override update(delta: number): void {
        let angle=this.direction.toRad();
        let targetAngle=this.targetDirection.toRad();
        angle += 9*delta*GMath.deltaAngle(angle, targetAngle);
        this.direction = Vector.fromRad(angle);
        this.shotDelta += delta;
    }

    public getBulletLifetime(): number{
        return this.range/this.bulletSpeed;
    }

    public getGlobalOffset(): Vector{
        return this.direction.toUnit().times(this.offset.x).add(this.direction.cross().times(this.offset.y));
    }

    public shoot(): void{
        const world = this.getGameWorld();
        const transform = this.getTransform();
        const gameObject = this.getGameObject();
        if (!world || !transform || !gameObject) return;

        if(!this.isEnabled||!gameObject.enabled)
            return;
        if(this.getShotDelta()>=this.cooldown){
            const sW = 0.125;
            const zindex = this.getComponent(CanonRendererC)!.zindex-0.01;

            const spread = this.direction.cross().times(Math.random()*2*this.bulletSpraed-this.bulletSpraed);
            const bulletDirection = this.direction.toUnit().add(spread).toUnit();
            const offset = this.getGlobalOffset();
            
            
            let bullet = BulletC.bulletGO(
                gameObject,
                this.damage,
                this.width/2+GMath.symRand(sW)-this.width/6,
                this.getBulletLifetime(),
                zindex
            );
            
            const rigidBody = bullet.getComponent(RigidBodyC)!;
            const collider = bullet.getComponent(ColliderC)!;
            bullet.getComponent(PolygonRendererC)!.color = this.getComponent(PolygonRendererC)!.color.clone();
            bullet.getComponent(BulletRendererC)!.color = this.getComponent(PolygonRendererC)!.color.clone();

            collider.avoidObjectes.add(this.getGameObject()!);
            rigidBody.velocity = bulletDirection.times(this.bulletSpeed);

            bullet.getTransform().position = this.getTransform()!.position.add(offset);

            this.getComponent(SmokeRendererC)?.emitParticles(23, offset, this.direction.cross().times(this.bulletSpeed/7).add(this.direction.times(this.bulletSpeed/3)));
            this.getComponent(SmokeRendererC)?.emitParticles(23, offset, this.direction.cross().times(-this.bulletSpeed/7).add(this.direction.times(this.bulletSpeed/3)));
            bullet.getTransform().rotation = bulletDirection.toRad();
            world.spawn(bullet);

            this.shotDelta = 0;
        }
    }    
} 