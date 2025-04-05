import { RigidBodyC } from "../Components/RigidBody";
import { Plugin } from "../Core/Plugin";
export class PhysicsPlugin extends Plugin {
    name = "PhysicsPlugin";
    update(delta) {
        const totalDelta = this.gameWorld.getWorldTime();
        this.gameWorld.getComponents(RigidBodyC).forEach(rigidBody => rigidBody.update(delta));
    }
    fixedUpdate(delta) {
        const totalDelta = this.gameWorld.getWorldTime();
        this.gameWorld.getComponents(RigidBodyC).forEach(rigidBody => rigidBody.fixedUpdate(delta));
    }
}
