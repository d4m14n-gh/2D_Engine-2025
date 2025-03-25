import { Component } from "./Component";
import { GameWorld } from "./GameWorld";
import { Transform } from "../Helpers/Transform";

export class GameObject {
    private transform: Transform = new Transform();
    // private id: number = 0;
    private components: Map<string, Component> = new Map<string, Component>();
    
    public enabled: boolean = true;
    public name: string = "UnnamedGameObject";
    private gameWorld!: GameWorld;

    constructor (...components: Component[]) {
        for(let component of components){
            let name = component.constructor.name;
            if (this.components.has(name))
                throw new Error(`Component ${name} already exists in the game object`);
            
            (component as any).gameObject = this;
            this.components.set(name, component);
        }
    }
    public hasComponent<T extends Component>(classC: new (...args: any[]) => T): boolean{
        return this.components.has(classC.name);
    }
    public getComponent<T extends Component>(classC: new (...args: any[]) => T): T{
        const type=classC.name;
        if (!this.components.has(type))
            throw new Error(`Component doesn't ${type} exists in the game object`);

        return this.components.get(type) as T;
    }
    public getAllComponents(): Component[]{
        return Array.from(this.components.values()).filter(c=>c.isEnabled());
    }

    public destroy(): void{
        this.gameWorld.destroy(this);
    }
    public spawn(gameWorld: GameWorld): void{
        gameWorld.spawn(this);
    }
    public getTransform(): Transform{
        return this.transform;
    }
    public getGameWorld(): GameWorld{
        return this.gameWorld;
    }
}

