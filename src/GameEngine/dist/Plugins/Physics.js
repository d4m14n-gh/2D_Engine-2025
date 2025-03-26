import { RigidBodyC } from "../Components/RigidBody";
import { Plugin } from "../Core/Plugin";
export class PhysicsPlugin extends Plugin {
    update(delta) {
        const totalDelta = this.gameWorld.getTotal();
        this.gameWorld.getComponents(RigidBodyC).forEach(rigidBody => rigidBody.update(delta));
    }
    fixedUpdate(delta) {
        const totalDelta = this.gameWorld.getTotal();
        this.gameWorld.getComponents(RigidBodyC).forEach(rigidBody => rigidBody.fixedUpdate(delta));
    }
}
