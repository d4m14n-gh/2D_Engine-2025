import { Component } from "./Component";
import { GameWorld } from "./GameWorld";
import { Transform } from "../Helpers/Transform";
import { v4 as uuidv4 } from 'uuid';

export class GameObject {
    public enabled: boolean = true;
    public name: string = "UnnamedGameObject";
    
    private id: string = uuidv4(); 
    private transform: Transform = new Transform();
    private components: { [key: string]: Component } = {};
    private gameWorld?: GameWorld;

    constructor (...components: Component[]) {
        for(let component of components){
            let name = component.constructor.name;
            if (Object.prototype.hasOwnProperty.call(this.components, name))
                throw new Error(`Component ${name} already exists in the game object`);
            (component as any).gameObject = this;
            this.components[name] = component;
        }
    }
    public hasComponent<T extends Component>(classC: new (...args: any[]) => T): boolean{
        return Object.prototype.hasOwnProperty.call(this.components, classC.name);
    }
    public getComponent<T extends Component>(classC: new (...args: any[]) => T): T | undefined {
        const type=classC.name;
        return this.components[type] as T | undefined;
    }
    public getAllComponents(onlyEnabled: boolean=false): Component[]{
        return Object.values(this.components).filter(c=>onlyEnabled ? c.isEnabled() : true);
    }

    public getId(): string{
        return this.id;
    }
    public getTransform(): Transform{
        return this.transform;
    }
    public getGameWorld(): GameWorld | undefined {
        if (!this.gameWorld?.hasGameObject(this.id))
            this.gameWorld = undefined;
        return this.gameWorld;
    }
}

