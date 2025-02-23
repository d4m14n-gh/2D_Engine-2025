import { Component } from "./Component";
import { GameWorld } from "./GameWorld";
import { Transform } from "./Helpers/Transform";
import { StandaloneComponent } from "./Components/StandaloneComponent";
import { RigidBodyC } from "./Components/RigidBody";

export class GameObject {
    public transform: Transform = new Transform();
    private components: Map<string, Component> = new Map<string, Component>();

    public enabled: boolean = true;
    public name: string = "UnnamedGameObject";
    public gameWorld!: GameWorld;

    constructor (...components: Component[]) {
        for(let component of components){
            let name = component.constructor.name;
            if (this.components.has(name))
                throw new Error(`Component ${name} already exists in the game object`);
            
            component.gameObject = this;
            this.components.set(name, component);
        }
    }
    public hasComponent(type: string): boolean{
        return this.components.has(type);
    }
    public getComponent<T extends Component>(type: string): T{
        if (!this.components.has(type))
            throw new Error(`Component doesn't ${type} exists in the game object`);

        return this.components.get(type) as T;
    }
    public getAllComponents(): Component[]{
        return Array.from(this.components.values()).filter(c=>c.enabled);
    }

    public destroy(): void{
        this.gameWorld.destroy(this);
    }
    public spawn(gameWorld: GameWorld): void{
        gameWorld.spawn(this);
    }


    //custom methods
    public getRigidBody(): RigidBodyC{
        return this.getComponent<RigidBodyC>(RigidBodyC.name);
    }
}

