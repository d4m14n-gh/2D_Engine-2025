import { RigidBodyC } from "../Components/RigidBody";
import { EventArgs, ISubscriber } from "./GameEvent";
import { GameObject } from "./GameObject";
import { GameWorld } from "./GameWorld";
import { Transform } from "../Helpers/Transform";
import { Plugin } from "./Plugin";

export abstract class Component implements ISubscriber {
    private enabled: boolean = true;
    private gameObject!: WeakRef<GameObject>;
    // private gameObjectId: string = "";
    
    //overideable methods
    protected start(): void{ }
    protected event(args: EventArgs, alias?: string): void{ }

    
    public getGameWorld(): GameWorld{
        const gameObject = this.getGameObject();
        return this.gameObject.deref()!.getGameWorld();
    }
    public hasComponent<T extends Component>(classC: new (...args: any[]) => T): boolean{
        return this.gameObject.deref()!.hasComponent(classC);
    }
    public getComponent<T extends Component>(classC: new (...args: any[]) => T): T{
        return this.gameObject.deref()!.getComponent(classC);
    }
    public getAllComponents(): Component[]{
        return this.gameObject.deref()!.getAllComponents();
    }


    public getTransform(): Transform{
        return this.gameObject.deref()!.getTransform();
    }
    public getGameObject(): GameObject{
        return this.gameObject.deref()!;
    }
    public getPlugin<T extends Plugin>(plugin: new (...args: any[]) => T): T{
        return this.getGameWorld().getPlugin(plugin);
    }
    public isEnabled(): boolean{
        return this.gameObject.deref()!.enabled&&this.enabled;
    }
    public enable(value=true): void{
        this.enabled=value;
    }
}