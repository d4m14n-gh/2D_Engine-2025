import { BodyC } from "../Components/Body";
import { Plugin } from "../Core/Plugin";
import * as pl from "planck-js";
import { GOManagerPlugin } from "./GOManager";


export class PhysicsPlugin extends Plugin {
    public name: string = "PhysicsPlugin";
    private world: pl.World = new pl.World();

   
    public override update(delta: number): void {
        const totalDelta: number = this.gameWorld!.getWorldTime();
        for (let body of this.getPlugin(GOManagerPlugin).getComponents(BodyC)) 
            (body as any).update(delta);
        this.world.step(delta);
    }

    public getWorld(): pl.World {
        return this.world;
    }
}