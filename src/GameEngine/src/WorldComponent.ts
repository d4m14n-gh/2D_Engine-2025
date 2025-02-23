import { Component } from "./Component";
import { GameWorld } from "./GameWorld";

//WorldComponent = Plugin
export abstract class WorldComponent {
    public gameWorld!: GameWorld;
    public enabled: boolean = true;
    // private childComponents: Set<Component> = new Set<Component>();

    constructor(){
        this.awake();
    }

    //overideable methods
    public awake(): void { }
    public start(): void { }
    public update(delta: number, totalDelta: number): void { }
    public fixedUpdate(delta: number, totalDelta: number): void { }
    
    //methods
    // public add(component: Component): void {
    //     if (this.childComponents.has(component)){
    //         throw new Error("Component already exists in the world component");
    //     }
    //     this.childComponents.add(component);
    // }
    // public remove(component: Component): void {
    //     if (!this.childComponents.has(component)){
    //         throw new Error("Component does'not exist in the world component");
    //     }
    //     this.childComponents.delete(component);
    // }
    // public getComponents(): Set<Component> {
    //     return this.childComponents;
    // }
}