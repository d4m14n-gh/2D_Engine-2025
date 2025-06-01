import { RigidBodyC } from "../Components/RigidBody";
import { Plugin } from "../Core/Plugin";
import * as rp from "@dimforge/rapier2d";
import { GOManagerPlugin } from "./GOManager";
import { Vector } from "../Helpers/Vector";


export class PhysicsPlugin extends Plugin {
    public name: string = "PhysicsPlugin";
    private world: rp.World = new rp.World(new Vector(0, 0));
   
    public override fixedUpdate(delta: number): void {
        for (let body of this.getPlugin(GOManagerPlugin).getComponents(RigidBodyC)) 
            (body as any).update(delta); // aktualizacja ciał fizycznych
        this.world.step(); // fizyka krok
        console.log("Physics step completed");
    }

    public getWorld(): rp.World {
        return this.world;
    }
}