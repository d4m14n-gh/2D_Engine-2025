import { Component } from "../Core/Component";
import { Vector } from "../Helpers/Vector";

export class RigidBodyC extends Component {
    public velocity: Vector;
    public acceleration: Vector = Vector.zero();
    public mass: number = 1;
    public dampingFactor: number;
    public angularVelocity: number = 0;
    public angularAcceleration: number = 0;
    public angularDrag: number = 0.01;

    constructor(mass: number, dampingFactor=0.45){
        super();
        const s=15;
        this.velocity = new Vector(Math.random()*s*2-s, Math.random()*s*2-s);
        this.dampingFactor = dampingFactor;
        this.mass = mass;
    }

    public update(delta: number): void {
        this.velocity = this.velocity.add(this.acceleration.times(delta));
        this.velocity = this.velocity.times(Math.pow(this.dampingFactor, delta));
        this.getTransform().position = this.getTransform().position.add(this.velocity.times(delta));
        this.getTransform().position = this.getTransform().position.add(this.acceleration.times(delta*delta/2));
      
        this.getTransform().rotation += this.angularVelocity * delta;
        this.angularVelocity = (this.angularVelocity+this.angularAcceleration * delta) * (1 - this.angularDrag);
    }
    public fixedUpdate(delta: number): void {
    }
}