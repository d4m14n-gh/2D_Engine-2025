import { Component } from "./Component";
import { GameWorld } from "./GameWorld";
import { Transform } from "../Helpers/Transform";
import { v4 as uuidv4 } from 'uuid';

export class GameObject {
    public enabled: boolean = true;
    public name: string = "UnnamedGameObject";
    
    private id: string = uuidv4(); 
    private transform: Transform = new Transform();
    private components: Map<string, Component> = new Map();
    private extraComponents: Map<string, Component[]> = new Map();
    private gameWorld?: GameWorld;

    private insertComponent<T extends Component>(component: T): void {
        let name = component.constructor.name;
        if (this.components.has(name)){
            this.extraComponents.set(name, []);
            this.extraComponents.get(name)?.push(component);
        }
        else{
            this.components.set(name, component);
        }
        (component as any).gameObject = this;
    }

    constructor (...components: Component[]) {
        components.forEach(c => this.insertComponent(c));
    }
    public hasComponent<T extends Component>(classC: new (...args: any[]) => T): boolean{
        return this.components.has(classC.name);
    }
    public getComponent<T extends Component>(classC: new (...args: any[]) => T): T | undefined {
        return this.components.get(classC.name) as T | undefined;
    }
    public getExtraComponent<T extends Component>(classC: new (...args: any[]) => T, index: number): T | undefined {
        return this.components.get(classC.name) as T | undefined;
    }
    public getAllComponents(onlyEnabled: boolean=false): Component[]{
        return Array.from(this.components.values()).filter(c=>onlyEnabled ? c.isEnabled() : true);
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

