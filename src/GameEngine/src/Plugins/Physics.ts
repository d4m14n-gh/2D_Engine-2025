import { BodyC } from "../Components/Body";
import { Plugin } from "../Core/Plugin";
import * as pl from "planck-js";
import { GOManagerPlugin } from "./GOManager";


export class PhysicsPlugin extends Plugin {
    public name: string = "PhysicsPlugin";
    private world: pl.World = new pl.World();
    private accumalator: number = 0;
    private readonly fixedTimeStep: number = 1 / 30;

   
    public override update(delta: number): void {
        delta = Math.min(delta, 0.25); // np. 250 ms

        this.accumalator += delta;

        while (this.accumalator >= this.fixedTimeStep) {
            for (let body of this.getPlugin(GOManagerPlugin).getComponents(BodyC)) 
                (body as any).update(this.fixedTimeStep);
            this.world.step(this.fixedTimeStep); // fizyka krok
            this.accumalator -= this.fixedTimeStep;
        }
        
        // const totalDelta: number = this.gameWorld!.getWorldTime();
        // this.world.step(delta);
    }

    public getWorld(): pl.World {
        return this.world;
    }
}