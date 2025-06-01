import { RigidBodyC } from "../Components/RigidBody";
import { Plugin } from "../Core/Plugin";
import * as rp from "@dimforge/rapier2d";
import { GOManagerPlugin } from "./GOManager";
import { Vector } from "../Helpers/Vector";


export class PhysicsPlugin extends Plugin {
    public name: string = "PhysicsPlugin";
    private world: rp.World = new rp.World(new Vector(0, 0));

   
    public override update(delta: number): void {
        const totalDelta: number = this.gameWorld!.getWorldTime();
        for (let body of this.getPlugin(GOManagerPlugin).getComponents(RigidBodyC)) 
            (body as any).update(delta);
        this.world.step();
    }

    public getWorld(): rp.World {
        return this.world;
    }
}