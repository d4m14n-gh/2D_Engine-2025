"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RigidBodyC = void 0;
const Component_1 = require("../Core/Component");
const Vector_1 = require("../Helpers/Vector");
class RigidBodyC extends Component_1.Component {
    velocity;
    acceleration = Vector_1.Vector.zero();
    mass = 1;
    drag;
    angularVelocity = 0;
    angularAcceleration = 0;
    angularDrag = 0.01;
    constructor(mass, drag = 0.01) {
        super();
        const s = 15;
        this.velocity = new Vector_1.Vector(Math.random() * s * 2 - s, Math.random() * s * 2 - s);
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
exports.RigidBodyC = RigidBodyC;
