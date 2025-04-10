import { Component } from "./Component";
import { GameWorld } from "../Core/GameWorld";
import { Subscriber } from "./GameEvent";

//WorldComponent = Plugin
export abstract class Plugin implements Subscriber {
    public gameWorld!: GameWorld;
    public enabled: boolean = true;
    public readonly name: string = "Plugin";

    //overideable methods
    protected event(args: any, alias?: string): void {}
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