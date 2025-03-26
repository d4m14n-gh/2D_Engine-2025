import { Component } from "../Core/Component";
import { AnimationC } from "./Animation";
import { ColliderC } from "./Collider";
import { RigidBodyC } from "./RigidBody";
import { PolygonRendererC } from "./Renderers/PolygonRenderer";
import { EventArgs, GameEvent } from "../Core/GameEvent";
export class DamageEventArgs extends EventArgs {
    damage;
    participant;
    constructor(damage, participant) {
        super();
        this.damage = damage;
        this.participant = participant;
    }
}
export class HealthC extends Component {
    health;
    maxHealth;
    damageEvent;
    constructor(maxHealth, health = maxHealth) {
        super();
        this.health = health;
        this.maxHealth = maxHealth;
        this.damageEvent = new GameEvent();
    }
    collisionEnterKey;
    onSpawn() {
        this.collisionEnterKey = this.getComponent(ColliderC).onCollisionEnterEvent.subscribe(this);
    }
    onEvent(key, args) {
        if (key.equals(this.collisionEnterKey)) {
            let cargs = args;
            this.onCollisionEnter(cargs.collider);
        }
    }
    onCollisionEnter(other) {
        let otherGO = other.getGameObject();
        let otherRigidbody = otherGO.getComponent(RigidBodyC);
        let thisRigidbody = this.getComponent(RigidBodyC);
        let op = thisRigidbody.mass / (otherRigidbody.mass + thisRigidbody.mass);
        if (thisRigidbody.mass < otherRigidbody.mass) {
            otherRigidbody.velocity = otherRigidbody.velocity.add(thisRigidbody.velocity.times(op)); //toUnit().times(v2);
            thisRigidbody.velocity = thisRigidbody.velocity.add(otherRigidbody.velocity.times(1 - op)); //toUnit().times(v2);
        }
        otherRigidbody.angularVelocity -= this.getTransform().position.sub(otherGO.getTransform().position).vectorProduct(thisRigidbody.velocity) * (op / 10);
        try {
            const other = otherGO.getComponent(HealthC);
            const damageValue = Math.min(other.health, this.health);
            if (damageValue == 0)
                return;
            this.onDamage(damageValue, other);
            other.onDamage(damageValue, this);
        }
        catch { }
    }
    onCollisionExit(other) {
    }
    getHealth() {
        return this.health / this.maxHealth;
    }
    heal(value) {
        this.health = Math.min(this.maxHealth, this.health + value);
    }
    onDamage(value, participant) {
        this.health -= value;
        this.damageEvent.addInvokeArgs(new DamageEventArgs(value, participant));
        this.damageEvent.invoke();
        if (this.health == 0) {
            this.getComponent(ColliderC).enable(false);
            this.getComponent(RigidBodyC).drag = 0.025;
            if (participant.hasComponent(PolygonRendererC)) {
                let myColor = this.getComponent(PolygonRendererC).color;
                let newColor = myColor.blend(participant.getComponent(PolygonRendererC).color.toRgb(), 0.5);
                this.getComponent(PolygonRendererC).color = newColor;
                participant.getComponent(PolygonRendererC).color = newColor;
            }
            try {
                this.getComponent(AnimationC).startShrink();
            }
            catch { }
        }
        else {
            try {
                this.getComponent(AnimationC).startZoom();
            }
            catch { }
        }
    }
}
