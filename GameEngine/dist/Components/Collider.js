import { Component } from "../Core/Component";
import { EventArgs, GameEvent } from "../Core/GameEvent";
import { Vector } from "../Helpers/Vector";
export class CollisionEventArgs extends EventArgs {
    collider;
    constructor(collider) {
        super();
        this.collider = collider;
    }
}
export class ColliderC extends Component {
    offset = Vector.zero();
    radius;
    isActive = false;
    isStatic;
    // public layer: number;
    avoidObjectes;
    collisions = new Set();
    onCollisionEnterEvent = new GameEvent();
    onCollisionExitEvent = new GameEvent();
    constructor(radius = 1, isStatic = true, ...avoidObjectes) {
        super();
        this.radius = radius;
        this.isStatic = isStatic;
        this.avoidObjectes = new Set();
        avoidObjectes.forEach(ao => this.avoidObjectes.add(ao));
    }
    getCenter() {
        return this.getTransform().position.add(this.offset);
    }
    collides(other) {
        return ((this.getCenter())
            .sub(other.getCenter())
            .magnitude() <= this.radius + other.radius)
            && !this.avoidObjectes.has(other.getGameObject()) && !other.avoidObjectes.has(this.getGameObject());
    }
    onCollisionEnter(other) {
        this.onCollisionEnterEvent.addInvokeArgs(new CollisionEventArgs(other));
        this.onCollisionEnterEvent.invoke();
    }
    onCollisionExit(other) {
        this.onCollisionExitEvent.addInvokeArgs(new CollisionEventArgs(other));
        this.onCollisionExitEvent.invoke();
    }
}
