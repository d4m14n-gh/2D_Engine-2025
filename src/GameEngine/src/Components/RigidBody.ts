import { Component } from "../Core/Component";
import { Vector } from "../Helpers/Vector";

export class RigidBodyC extends Component {
    public velocity: Vector;
    public acceleration: Vector = Vector.zero();
    public mass: number = 1;
    public drag: number;
    public angularVelocity: number = 0;
    public angularAcceleration: number = 0;
    public angularDrag: number = 0.01;

    constructor(mass: number, drag=0.01){
        super();
        const s=15;
        this.velocity = new Vector(Math.random()*s*2-s, Math.random()*s*2-s);
        this.drag = drag;
        this.mass = mass;
    }

    public update(delta: number): void {
        this.getTransform().position = this.getTransform().position.add(this.velocity.times(delta)).add(this.acceleration.times(delta*delta/2));
        this.getTransform().rotation += this.angularVelocity * delta;
        this.velocity = this.velocity.add(this.acceleration.times(delta)).times(1 - this.drag);
        this.angularVelocity = (this.angularVelocity+this.angularAcceleration * delta) * (1 - this.angularDrag);
    }
    public fixedUpdate(delta: number): void {
    }
}