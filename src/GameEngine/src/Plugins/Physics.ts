import { RigidBodyC } from "../Components/RigidBody";
import { Plugin } from "../Core/Plugin";

export class PhysicsPlugin extends Plugin {
   
    public override update(delta: number): void {
        const totalDelta: number = this.gameWorld.getTotal();
        this.gameWorld.getComponents(RigidBodyC).forEach(rigidBody => rigidBody.update(delta));
    }
   
    public override fixedUpdate(delta: number): void {
        const totalDelta: number = this.gameWorld.getTotal();
        this.gameWorld.getComponents(RigidBodyC).forEach(rigidBody => rigidBody.fixedUpdate(delta));
    }
}