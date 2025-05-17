import { error } from "console";
import { Component } from "../Core/Component";
import { Vector } from "../Helpers/Vector";
import * as pl from "planck-js";
import { PhysicsPlugin } from "../Plugins/Physics";

export class BodyC extends Component {
    private body!: pl.Body;
    private bodyDef: pl.BodyDef = {
        type: 'dynamic',
        
        position: new pl.Vec2(0, 0),
        linearVelocity: new pl.Vec2(0, 0),
        linearDamping: 0,

        angle: 0,
        angularVelocity: 0,
        angularDamping: 0.2,
        
        fixedRotation: false,
        bullet: false,
        allowSleep: true,
    };
    private force = new Vector(0, 0);
    // public readonly type: pl.BodyType = pl.Body.Dynamic;
    
    constructor(dampingFactor=0.45){
        super();
        this.setDamping(dampingFactor);
    }

    override spawn(): void {
        console.log("BodyC spawned");
        this.body = this.getPlugin(PhysicsPlugin)!.getWorld().createBody(this.bodyDef);
        this.body.createFixture(new pl.Circle(0.5), { density: 1.0 });
    }
    override destroy(): void {
        console.log("BodyC destroyed");
        this.getPlugin(PhysicsPlugin)?.getWorld().destroyBody(this.body);
    }

    private update(delta: number): void {
        this.body.applyForceToCenter(this.force); // = this.body;
    }


    //set parameters
    public setPosition(position: Vector): void {
        if (this.body)
            this.body.setPosition(position);
        else 
            this.bodyDef.position = position;
    }
    public getPosition(): Vector {
        return Vector.fromVec2(this.body.getPosition())??this.bodyDef.position??new Vector(0, 0);
    }
    public setRotation(rotation: number): void {
        if (this.body)
            this.body.setAngle(rotation);
        else
            this.bodyDef.angle = rotation;
    }
    public getRotation(): number {
        return this.body.getAngle()??this.bodyDef.angle??0;
    }
    public setVelocity(velocity: Vector): void {
        if (this.body)
            this.body.setLinearVelocity(velocity);
        else
            this.bodyDef.linearVelocity = velocity;
    }
    public getVelocity(): Vector {
        return Vector.fromVec2(this.body.getLinearVelocity())??this.bodyDef.linearVelocity??new Vector(0, 0);
    }
    public setAngularVelocity(angularVelocity: number): void {
        if (this.body)
            this.body.setAngularVelocity(angularVelocity);
        else
            this.bodyDef.angularVelocity = angularVelocity;
    }
    public getAngularVelocity(): number {
        return this.body.getAngularVelocity()??this.bodyDef.angularVelocity??0;
    }
    public setAngularDamping(angularDamping: number): void {
        if (this.body)
            this.body.setAngularDamping(angularDamping);
        else
            this.bodyDef.angularDamping = angularDamping;
    }
    public getAngularDamping(): number {
        return this.body.getAngularDamping()??this.bodyDef.angularDamping??0;
    }
    public setDamping(linearDamping: number): void {
        if (this.body)
            this.body.setLinearDamping(linearDamping);
        else
            this.bodyDef.linearDamping = linearDamping;
    }
    public getDamping(): number {
        return this.body.getLinearDamping()??this.bodyDef.linearDamping??0;
    }
    public setFixedRotation(fixedRotation: boolean): void {
        if (this.body)
            this.body.setFixedRotation(fixedRotation);
        else
            this.bodyDef.fixedRotation = fixedRotation;
    }
    public getFixedRotation(): boolean {
        return this.body.isFixedRotation()??this.bodyDef.fixedRotation??false;
    }
    public setBullet(bullet: boolean): void {
        if (this.body)
            this.body.setBullet(bullet);
        else
            this.bodyDef.bullet = bullet;
    }
    public getBullet(): boolean {
        return this.body.isBullet()??this.bodyDef.bullet??false;
    }
    public setAllowSleep(allowSleep: boolean): void {
        if (this.body)
            this.body.setSleepingAllowed(allowSleep);
        else
            this.bodyDef.allowSleep = allowSleep;
    }
    public getAllowSleep(): boolean {
        return this.body.isSleepingAllowed()??this.bodyDef.allowSleep??false;
    }


    //forces
    public setForce(force: Vector): void {
        this.force = force;
    }
    public getForce(): Vector {
        return this.force;
    }
}