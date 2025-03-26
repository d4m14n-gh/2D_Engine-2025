import { GameObjectFactory } from "../GameObjectFactory";
import { GMath } from "../Helpers/Math";
import { Vector } from "../Helpers/Vector";
import { ColliderC } from "./Collider";
import { CanonRendererC } from "./Renderers/CanonRenderer";
import { PolygonRendererC } from "./Renderers/PolygonRenderer";
import { RigidBodyC } from "./RigidBody";
import { StandaloneComponent } from "./StandaloneComponent";
export class CanonC extends StandaloneComponent {
    damage;
    cooldown = 0.15;
    bulletSpeed = 40;
    length;
    width;
    range = 250;
    bulletSpraed = 0.1;
    offset;
    direction = Vector.right();
    targetDirection = Vector.right();
    lastShootTime = -10;
    constructor(length = 4, width = 2, damage = 10) {
        super();
        this.damage = damage;
        this.length = length;
        this.width = width;
        this.offset = new Vector(length - width / 2, 0);
    }
    getShotDelta() {
        let totalTime = this.getGameWorld().getTotal();
        return totalTime - this.lastShootTime;
    }
    update(delta) {
        let angle = this.direction.toRad();
        let targetAngle = this.targetDirection.toRad();
        angle += 9 * delta * GMath.deltaAngle(angle, targetAngle);
        this.direction = Vector.fromRad(angle);
    }
    getBulletLifetime() {
        return this.range / this.bulletSpeed;
    }
    getGlobalOffset() {
        return this.direction.toUnit().times(this.offset.x).add(this.direction.cross().times(this.offset.y));
    }
    shoot() {
        if (!this.isEnabled || !this.getGameObject().enabled)
            return;
        if (this.getShotDelta() >= this.cooldown) {
            const sW = 0.125;
            const zindex = this.getComponent(CanonRendererC).zindex - 0.01;
            let bullet = GameObjectFactory.bulletGO(this.getGameObject(), this.damage, this.width / 2 + GMath.symRand(sW), this.getBulletLifetime(), zindex);
            let rigidBody = bullet.getComponent(RigidBodyC);
            let collider = bullet.getComponent(ColliderC);
            let renderer = bullet.getComponent(PolygonRendererC);
            renderer.color = this.getComponent(PolygonRendererC).color.clone();
            collider.avoidObjectes.add(this.getGameObject());
            bullet.getTransform().position = this.getTransform().position.add(this.getGlobalOffset());
            let spread = this.direction.cross().times(Math.random() * 2 * this.bulletSpraed - this.bulletSpraed);
            rigidBody.velocity = this.direction.toUnit().add(spread).times(this.bulletSpeed);
            // rigidBody.velocity = rigidBody.velocity .add(this.getComponent(RigidBodyC).velocity.times(0.25)); 
            bullet.spawn(this.getGameWorld());
            this.lastShootTime = this.getGameWorld().getTotal();
        }
    }
}
