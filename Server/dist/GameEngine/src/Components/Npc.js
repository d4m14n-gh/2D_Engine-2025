"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NpcC = exports.NpcType = void 0;
const Vector_1 = require("../Helpers/Vector");
const Canon_1 = require("./Canon");
const StandaloneComponent_1 = require("./StandaloneComponent");
const Bullet_1 = require("./Bullet");
const RigidBody_1 = require("./RigidBody");
const Math_1 = require("../Helpers/Math");
const Health_1 = require("./Health");
var NpcType;
(function (NpcType) {
    NpcType[NpcType["neutral"] = 0] = "neutral";
    NpcType[NpcType["passive"] = 1] = "passive";
    NpcType[NpcType["aggresive"] = 2] = "aggresive";
})(NpcType || (exports.NpcType = NpcType = {}));
class NpcC extends StandaloneComponent_1.StandaloneComponent {
    type = NpcType.aggresive;
    isAttacing = false;
    target;
    isFollowing = false;
    minDistance = 100;
    maxDistance = 1000;
    maxSpeed = 10;
    constructor() {
        super();
    }
    onEvent(key, args) {
        if (key.equals(this.damageKey)) {
            let damageArgs = args;
            const other = damageArgs.participant;
            if (other.hasComponent(Bullet_1.BulletC) && other.getComponent(Bullet_1.BulletC).getOwner())
                this.attack(other.getComponent(Bullet_1.BulletC).getOwner());
        }
    }
    attack(gameObject) {
        this.isAttacing = true;
        this.target = new WeakRef(gameObject);
        this.isFollowing = true;
    }
    damageKey;
    start() {
        let health = this.getComponent(Health_1.HealthC);
        this.damageKey = health.damageEvent.subscribe(this);
    }
    update(delta) {
        if (!this.target || !this.target.deref()) {
            this.isAttacing = false;
            return;
        }
        if (this.isAttacing) {
            let turret = this.getComponent(Canon_1.CanonC);
            let target = this.target.deref();
            let direction = target.getTransform().position.sub(this.getTransform().position);
            turret.targetDirection = direction;
            let distance = direction.magnitude();
            if (distance > this.maxDistance)
                this.isAttacing = false;
            turret.shoot();
            if (distance >= this.minDistance) {
                let angle = this.getTransform().rotation;
                let targetAngle = direction.toRad();
                angle += 5 * delta * Math_1.GMath.deltaAngle(angle, targetAngle);
                this.getTransform().rotation = angle;
                let rigidBody = this.getComponent(RigidBody_1.RigidBodyC);
                rigidBody.velocity = Vector_1.Vector.fromRad(angle).times(this.maxSpeed);
            }
        }
    }
}
exports.NpcC = NpcC;
