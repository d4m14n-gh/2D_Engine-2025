import { Component } from "./Component";
import { GameWorld } from "./GameWorld";
import { Transform } from "../Helpers/Transform";
import { v4 as uuidv4 } from 'uuid';

export class GameObject {
    public enabled: boolean = true;
    public name: string = "UnnamedGameObject";
    
    private transform: Transform = new Transform();
    private components: Map<string, Component> = new Map<string, Component>();
    private id: string = uuidv4(); 
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
        return this.components.get(type) as T;
    }
    public getAllComponents(onlyEnabled: boolean=false): Component[]{
        return Array.from(this.components.values()).filter(c=>onlyEnabled ? c.isEnabled() : true);
    }

    public destroy(): void{
        this.gameWorld.destroy(this);
    }
    public spawn(gameWorld: GameWorld): GameObject{
        return gameWorld.spawn(this);
    }
    public getId(): string{
        return this.id;
    }
    public getTransform(): Transform{
        return this.transform;
    }
    public getGameWorld(): GameWorld{
        return this.gameWorld;
    }
}

