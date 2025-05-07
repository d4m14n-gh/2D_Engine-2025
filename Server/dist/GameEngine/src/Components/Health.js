"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthC = exports.DamageEventArgs = void 0;
const Component_1 = require("../Core/Component");
const Animation_1 = require("./Animation");
const Collider_1 = require("./Collider");
const RigidBody_1 = require("./RigidBody");
const PolygonRenderer_1 = require("./Renderers/PolygonRenderer");
const GameEvent_1 = require("../Core/GameEvent");
class DamageEventArgs extends GameEvent_1.EventArgs {
    damage;
    participant;
    constructor(damage, participant) {
        super();
        this.damage = damage;
        this.participant = participant;
    }
}
exports.DamageEventArgs = DamageEventArgs;
class HealthC extends Component_1.Component {
    health;
    maxHealth;
    damageEvent;
    constructor(maxHealth, health = maxHealth) {
        super();
        this.health = health;
        this.maxHealth = maxHealth;
        this.damageEvent = new GameEvent_1.GameEvent();
    }
    collisionEnterKey;
    onSpawn() {
        this.collisionEnterKey = this.getComponent(Collider_1.ColliderC).onCollisionEnterEvent.subscribe(this);
    }
    onEvent(key, args) {
        if (key.equals(this.collisionEnterKey)) {
            let cargs = args;
            this.onCollisionEnter(cargs.collider);
        }
    }
    onCollisionEnter(other) {
        let otherGO = other.getGameObject();
        let otherRigidbody = otherGO.getComponent(RigidBody_1.RigidBodyC);
        let thisRigidbody = this.getComponent(RigidBody_1.RigidBodyC);
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
            this.getComponent(Collider_1.ColliderC).enable(false);
            this.getComponent(RigidBody_1.RigidBodyC).drag = 0.025;
            if (participant.hasComponent(PolygonRenderer_1.PolygonRendererC)) {
                let myColor = this.getComponent(PolygonRenderer_1.PolygonRendererC).color;
                let newColor = myColor.blend(participant.getComponent(PolygonRenderer_1.PolygonRendererC).color.toRgb(), 0.5);
                this.getComponent(PolygonRenderer_1.PolygonRendererC).color = newColor;
                participant.getComponent(PolygonRenderer_1.PolygonRendererC).color = newColor;
            }
            try {
                this.getComponent(Animation_1.AnimationC).startShrink();
            }
            catch { }
        }
        else {
            try {
                this.getComponent(Animation_1.AnimationC).startZoom();
            }
            catch { }
        }
    }
}
exports.HealthC = HealthC;
