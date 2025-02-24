import { RigidBodyC } from "../Components/RigidBody";
import { WorldComponent } from "../WorldComponent";

export class PhysicsPlugin extends WorldComponent {
   
    public override update(delta: number, totalDelta: number): void {
        this.gameWorld.getComponents<RigidBodyC>("RigidBodyC").forEach(rigidBody => rigidBody.update(delta, totalDelta));
    }
   
    public override fixedUpdate(delta: number, totalDelta: number): void {
        this.gameWorld.getComponents<RigidBodyC>("RigidBodyC").forEach(rigidBody => rigidBody.fixedUpdate(delta, totalDelta));
    }
}