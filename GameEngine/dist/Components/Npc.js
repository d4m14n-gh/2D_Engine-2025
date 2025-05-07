import { Vector } from "../Helpers/Vector";
import { CanonC } from "./Canon";
import { StandaloneComponent } from "./StandaloneComponent";
import { BulletC } from "./Bullet";
import { RigidBodyC } from "./RigidBody";
import { GMath } from "../Helpers/Math";
import { HealthC } from "./Health";
export var NpcType;
(function (NpcType) {
    NpcType[NpcType["neutral"] = 0] = "neutral";
    NpcType[NpcType["passive"] = 1] = "passive";
    NpcType[NpcType["aggresive"] = 2] = "aggresive";
})(NpcType || (NpcType = {}));
export class NpcC extends StandaloneComponent {
    type = NpcType.aggresive;
    isAttacing = false;
    target;
    isFollowing = false;
    minDistance = 100;
    maxDistance = 1000;
    maxSpeed = 10;
    start() {
        let health = this.getComponent(HealthC);
        health.damageEvent.subscribe(this);
    }
    event(args) {
        let damageArgs = args;
        const other = damageArgs.participant;
        if (other.hasComponent(BulletC) && other.getComponent(BulletC).getOwner())
            this.attack(other.getComponent(BulletC).getOwner());
    }
    attack(gameObject) {
        this.isAttacing = true;
        this.target = new WeakRef(gameObject);
        this.isFollowing = true;
    }
    update(delta) {
        if (!this.target || !this.target.deref()) {
            this.isAttacing = false;
            return;
        }
        if (this.isAttacing) {
            let turret = this.getComponent(CanonC);
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
                angle += 5 * delta * GMath.deltaAngle(angle, targetAngle);
                this.getTransform().rotation = angle;
                let rigidBody = this.getComponent(RigidBodyC);
                rigidBody.velocity = Vector.fromRad(angle).times(this.maxSpeed);
            }
        }
    }
}
