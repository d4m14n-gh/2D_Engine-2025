import { RigidBodyC } from "../Components/RigidBody";
import { Plugin } from "../Core/Plugin";

export class PhysicsPlugin extends Plugin {
    public name: string = "PhysicsPlugin";
   
    public override update(delta: number): void {
        const totalDelta: number = this.gameWorld.getWorldTime();
        this.gameWorld.getComponents(RigidBodyC).forEach(rigidBody => rigidBody.update(delta));
    }
}