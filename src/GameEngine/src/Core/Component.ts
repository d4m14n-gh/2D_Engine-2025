import { EventArgs, ISubscriber } from "./GameEvent";
import { Plugin } from "./Plugin";
import { v4 as uuidv4 } from 'uuid';
import { GameObject } from "./GameObject";
import { GameWorld } from "./GameWorld";
import { BodyC } from "../Components/Body";
import { GOManagerPlugin } from "../Plugins/GOManager";
// import { BodyC } from "../Components/Body";

export abstract class Component implements ISubscriber {
    public enabled: boolean = true;
    public readonly id: string = uuidv4();
    public readonly gameObject?: GameObject;
    
    //overideable methods
    protected spawn(): void{ }
    protected start(): void{ }
    protected event(args: EventArgs, alias?: string): void{ }
    protected destroy(): void{ }

    public getComponent<T extends Component>(classC: new (...args: any[]) => T): T | undefined{
        return this.gameObject?.getComponent(classC);
    }
    public getAllComponents(): Component[]{
        return this.gameObject?.getAllComponents()??[];
    }
    public getPlugin<T extends Plugin>(plugin: new (...args: any[]) => T): T | undefined {
        return this.gameObject?.manager?.getPlugin(plugin);
    }
    public getGameWorld(): GameWorld | undefined {
        return this.gameObject?.manager?.gameWorld;
    }
    public getManager(): GOManagerPlugin | undefined {
        return this.gameObject?.manager;
    }
    // public getBody(): BodyC | undefined {
    //     return this.gameObject?.getComponent(BodyC);
    // }
}   