import { Component } from "../Core/Component";
import { Vector } from "../Helpers/Vector";
export class RigidBodyC extends Component {
    velocity;
    acceleration = Vector.zero();
    mass = 1;
    drag;
    angularVelocity = 0;
    angularAcceleration = 0;
    angularDrag = 0.01;
    constructor(mass, drag = 0.01) {
        super();
        const s = 15;
        this.velocity = new Vector(Math.random() * s * 2 - s, Math.random() * s * 2 - s);
        this.drag = drag;
        this.mass = mass;
    }
    update(delta) {
    }
    fixedUpdate(delta) {
        this.getTransform().position = this.getTransform().position.add(this.velocity.times(delta));
        this.getTransform().rotation += this.angularVelocity * delta;
        this.velocity = this.velocity.add(this.acceleration.times(delta)).times(1 - this.drag);
        this.angularVelocity = (this.angularVelocity + this.angularAcceleration * delta) * (1 - this.angularDrag);
    }
}
