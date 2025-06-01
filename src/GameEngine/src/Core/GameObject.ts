import { GameWorld } from "./GameWorld";
import { v4 as uuidv4 } from 'uuid';
import { Component } from "./Component";
import { GOManagerPlugin } from "../Plugins/GOManager";
import { RigidBodyC } from "../Components/RigidBody";

export class GameObject {
    public enabled: boolean = true;
    public name: string = "GameObject";
    public readonly id: string = uuidv4(); 
    public readonly manager?: GOManagerPlugin = undefined;
    public readonly components: Map<string, Component> = new Map<string, Component>();

    constructor (...components: Component[]) {
        for(let component of components){
            const id = component.id;
            if (this.components.has(id))
                throw new Error(`Component with id: ${id} already exists in the game object`);
            
            (component as any).gameObject = this;
            this.components.set(id, component);
        }
    }
    public getComponent<T extends Component>(classC: new (...args: any[]) => T): T | undefined{
        return this.components.values().find(c => c instanceof classC) as T | undefined;
    }
    public getComponents<T extends Component>(classC: new (...args: any[]) => T): T[]{
        return Array.from(this.components.values()).filter(c => c instanceof classC) as T[];
    }
    public getAllComponents(): Component[]{
        return Array.from(this.components.values());
    }
    public getBody(): RigidBodyC | undefined {
        return this.getComponent(RigidBodyC);
    }

    private spawn(): void {
        for(let component of this.components.values())
            if (component.enabled)
                (component as any).spawn();
    }
    private start(): void {
        for(let component of this.components.values())
            if (component.enabled)
                (component as any).start();
    }
    private update(): void {
        for(let component of this.components.values())
            if (component.enabled)
                (component as any).update();
    }
    private destroy(): void {
        for(let component of this.components.values())
            if (component.enabled)
                (component as any).destroy();
    }
}

