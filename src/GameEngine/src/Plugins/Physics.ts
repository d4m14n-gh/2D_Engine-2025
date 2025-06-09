import { RigidBodyC } from "../Components/RigidBody";
import { Plugin } from "../Core/Plugin";
import { PluginOrder } from "../Core/PluginOrder";

export class PhysicsPlugin extends Plugin {
    public readonly order: PluginOrder = PluginOrder.Physics;
    public name: string = "PhysicsPlugin";
   
    public override update(delta: number): void {
        const totalDelta: number = this.gameWorld.getWorldTime();
        this.gameWorld.getComponents(RigidBodyC).forEach(rigidBody => rigidBody.update(delta));
    }
}