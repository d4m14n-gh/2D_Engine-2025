import { Component } from "../Core/Component";
import { Vector } from "../Helpers/Vector";
import * as rp from "@dimforge/rapier2d";
import { PhysicsPlugin } from "../Plugins/Physics";

export class RigidBodyC extends Component {
    private body!: rp.RigidBody;
    private bodyDef: rp.RigidBodyDesc = rp.RigidBodyDesc
        .dynamic()
        .setTranslation(0, 0)
        .setLinvel(0, 0)
        .setLinearDamping(0)
        .setRotation(0)
        .setAngvel(0)
        .setAngularDamping(0.2).setCanSleep(true).setCcdEnabled(false);
   
    private force = new Vector(0, 0);
    
    constructor(dampingFactor=0.45){
        super();
        this.setDamping(dampingFactor);
    }

    override spawn(): void {
        console.log("BodyC spawned");
        this.body = this.getPlugin(PhysicsPlugin)!.getWorld().createRigidBody(this.bodyDef);
    }
    override destroy(): void {
        console.log("BodyC destroyed");
        this.getPlugin(PhysicsPlugin)?.getWorld().removeRigidBody(this.body);
    }

    private update(delta: number): void {
        this.body.resetForces(true);
        this.body.addForce(this.force, true); // = this.body;
    }


    //set parameters
    public setPosition(position: Vector): void {
        if (this.body)
            this.body.setTranslation(position, true);
        this.bodyDef.setTranslation(position.x, position.y);
    }
    public getPosition(): Vector {
        return Vector.fromVec2(this.body.translation())??this.bodyDef.translation??new Vector(0, 0);
    }
    public setRotation(rotation: number): void {
        if (this.body)
            this.body.setRotation(rotation, true);
        this.bodyDef.setRotation(rotation);
    }
    public getRotation(): number {
        return this.body.rotation()??this.bodyDef.rotation??0;
    }
    public setVelocity(velocity: Vector): void {
        if (this.body)
            this.body.setLinvel(velocity, true);
        this.bodyDef.setLinvel(velocity.x, velocity.y);
    }
    public getVelocity(): Vector {
        return Vector.fromVec2(this.body.linvel())??this.bodyDef.linvel??new Vector(0, 0);
    }
    public setAngularVelocity(angularVelocity: number): void {
        if (this.body)
            this.body.setAngvel(angularVelocity, true);
        this.bodyDef.setAngvel(angularVelocity);
    }
    public getAngularVelocity(): number {
        return this.body.angvel()??this.bodyDef.angvel??0;
    }
    public setAngularDamping(angularDamping: number): void {
        if (this.body)
            this.body.setAngularDamping(angularDamping);
        this.bodyDef.setAngularDamping(angularDamping);
    }
    public getAngularDamping(): number {
        return this.body.angularDamping()??this.bodyDef.angularDamping??0;
    }
    public setDamping(linearDamping: number): void {
        if (this.body)
            this.body.setLinearDamping(linearDamping);
        this.bodyDef.setLinearDamping(linearDamping);
    }
    public getDamping(): number {
        return this.body.linearDamping()??this.bodyDef.linearDamping??0;
    }
    public getRigidBody(): rp.RigidBody {
        return this.body;
    }
    // public setAllowSleep(allowSleep: boolean): void {
    //     if (this.body)
    //         this.body.setslep(allowSleep);
    //     this.bodyDef.allowSleep = allowSleep;
    // }
    // public getAllowSleep(): boolean {
    //     return this.body.isSleepingAllowed()??this.bodyDef.allowSleep??false;
    // }


    //forces
    public setForce(force: Vector): void {
        this.force = force;
    }
    public getForce(): Vector {
        return this.force;
    }
}