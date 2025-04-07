"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColliderC = exports.CollisionEventArgs = void 0;
const Component_1 = require("../Core/Component");
const GameEvent_1 = require("../Core/GameEvent");
const Vector_1 = require("../Helpers/Vector");
class CollisionEventArgs extends GameEvent_1.EventArgs {
    collider;
    constructor(collider) {
        super();
        this.collider = collider;
    }
}
exports.CollisionEventArgs = CollisionEventArgs;
class ColliderC extends Component_1.Component {
    offset = Vector_1.Vector.zero();
    radius;
    isActive = false;
    isStatic;
    // public layer: number;
    avoidObjectes;
    collisions = new Set();
    onCollisionEnterEvent = new GameEvent_1.GameEvent();
    onCollisionExitEvent = new GameEvent_1.GameEvent();
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
exports.ColliderC = ColliderC;
