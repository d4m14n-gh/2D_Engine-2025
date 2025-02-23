import { Component } from "../Component";
import { Vector } from "../Helpers/Vector";

export class RigidBodyC extends Component {
    public velocity: Vector;
    public acceleration: Vector = Vector.zero();
    public mass: number = 1;
    public drag: number;
    public angularVelocity: number = 0;
    public angularAcceleration: number = 0;
    public angularDrag: number = 0.01;

    constructor(drag=0.01){
        super();
        const s=15;
        this.velocity = new Vector(Math.random()*s*2-s, Math.random()*s*2-s);
        this.drag = drag;
    }

    public update(delta: number, totalDelta: number): void {
        
    }
    public fixedUpdate(delta: number, totalDelta: number): void {
        this.gameObject.transform.position = this.gameObject.transform.position.add(this.velocity.times(delta));
        this.gameObject.transform.rotation += this.angularVelocity * delta;
        this.velocity = this.velocity.add(this.acceleration.times(delta)).times(1 - this.drag);
        this.angularVelocity = (this.angularVelocity+this.angularAcceleration * delta) * (1 - this.angularDrag);
    }
}