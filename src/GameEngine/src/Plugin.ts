import { Component } from "./Component";
import { GameWorld } from "./GameWorld";

//WorldComponent = Plugin
export abstract class Plugin {
    public gameWorld!: GameWorld;
    public enabled: boolean = true;

    constructor(){
        this.awake();
    }

    //overideable methods
    public awake(): void { }
    public start(): void { }
    public update(delta: number): void { }
    public fixedUpdate(delta: number): void { }
    
    public getPlugin<T extends Plugin>(plugin: new (...args: any[]) => T): T{
        return this.gameWorld.getPlugin(plugin);
    }
    public hasPlugin<T extends Plugin>(plugin: new (...args: any[]) => T): boolean{
        return this.gameWorld.hasPlugin(plugin);
    }
}