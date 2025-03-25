import { Component } from "./Component";
import { GameWorld } from "../Core/GameWorld";

//WorldComponent = Plugin
export abstract class Plugin {
    public gameWorld!: GameWorld;
    public enabled: boolean = true;


    constructor(){
    }

    //overideable methods
    protected start(): void { }
    protected update(delta: number): void { }
    protected fixedUpdate(delta: number): void { }

    public getPlugin<T extends Plugin>(plugin: new (...args: any[]) => T): T{
        return this.gameWorld.getPlugin(plugin);
    }
    public hasPlugin<T extends Plugin>(plugin: new (...args: any[]) => T): boolean{
        return this.gameWorld.hasPlugin(plugin);
    }
}