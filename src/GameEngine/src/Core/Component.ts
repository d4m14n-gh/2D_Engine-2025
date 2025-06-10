import { RigidBodyC } from "../Components/RigidBody";
import { EventArgs, ISubscriber } from "./GameEvent";
import { GameObject } from "./GameObject";
import { GameWorld } from "./GameWorld";
import { Transform } from "../Helpers/Transform";
import { Plugin } from "./Plugin";

export abstract class Component implements ISubscriber {
    private enabled: boolean = true;
    private gameObject?: GameObject;
    
    //overideable methods
    protected start(): void{ }
    protected event(args: EventArgs, alias?: string): void{ }

    public getGameObject(): GameObject | undefined {
        return this.gameObject;
    }
    public getGameWorld(): GameWorld | undefined {
        return this.gameObject?.getGameWorld();
    }
    public getPlugin<T extends Plugin>(plugin: new (...args: any[]) => T): T | undefined {
        return this.gameObject?.getGameWorld()?.getPlugin(plugin);
    }


    public hasComponent<T extends Component>(classC: new (...args: any[]) => T): boolean{
        return this.gameObject?.hasComponent(classC) ?? false;
    }
    public getComponent<T extends Component>(classC: new (...args: any[]) => T): T | undefined{
        return this.gameObject?.getComponent(classC);
    }
    public getAllComponents(): Component[]{
        return this.gameObject?.getAllComponents() ?? [];
    }


    public isEnabled(): boolean{
        return (this.gameObject?.enabled??true) && this.enabled;
    }
    public enable(value=true): void{
        this.enabled=value;
    }

    
    public getTransform(): Transform | undefined {
        return this.gameObject?.getTransform();
    }
}