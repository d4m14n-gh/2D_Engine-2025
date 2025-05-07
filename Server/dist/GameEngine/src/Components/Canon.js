"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanonC = void 0;
const GameObjectFactory_1 = require("../GameObjectFactory");
const Math_1 = require("../Helpers/Math");
const Vector_1 = require("../Helpers/Vector");
const Collider_1 = require("./Collider");
const CanonRenderer_1 = require("./Renderers/CanonRenderer");
const PolygonRenderer_1 = require("./Renderers/PolygonRenderer");
const RigidBody_1 = require("./RigidBody");
const StandaloneComponent_1 = require("./StandaloneComponent");
class CanonC extends StandaloneComponent_1.StandaloneComponent {
    damage;
    cooldown = 0.15;
    bulletSpeed = 40;
    length;
    width;
    range = 250;
    bulletSpraed = 0.1;
    offset;
    direction = Vector_1.Vector.right();
    targetDirection = Vector_1.Vector.right();
    lastShootTime = -10;
    constructor(length = 4, width = 2, damage = 10) {
        super();
        this.damage = damage;
        this.length = length;
        this.width = width;
        this.offset = new Vector_1.Vector(length - width / 2, 0);
    }
    getShotDelta() {
        let totalTime = this.getGameWorld().getTotal();
        return totalTime - this.lastShootTime;
    }
    update(delta) {
        let angle = this.direction.toRad();
        let targetAngle = this.targetDirection.toRad();
        angle += 9 * delta * Math_1.GMath.deltaAngle(angle, targetAngle);
        this.direction = Vector_1.Vector.fromRad(angle);
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
            const zindex = this.getComponent(CanonRenderer_1.CanonRendererC).zindex - 0.01;
            let bullet = GameObjectFactory_1.GameObjectFactory.bulletGO(this.getGameObject(), this.damage, this.width / 2 + Math_1.GMath.symRand(sW), this.getBulletLifetime(), zindex);
            let rigidBody = bullet.getComponent(RigidBody_1.RigidBodyC);
            let collider = bullet.getComponent(Collider_1.ColliderC);
            let renderer = bullet.getComponent(PolygonRenderer_1.PolygonRendererC);
            renderer.color = this.getComponent(PolygonRenderer_1.PolygonRendererC).color.clone();
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
exports.CanonC = CanonC;
