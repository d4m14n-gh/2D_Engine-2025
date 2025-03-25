import { RigidBodyC } from "./Components/RigidBody";
import { GameObject } from "./GameObject";
import { GameWorld } from "./GameWorld";
import { Transform } from "./Helpers/Transform";
import { Plugin } from "./Plugin";

export abstract class Component {
    private enabled: boolean = true;
    private gameObject!: GameObject;
    
    
    protected onSpawn(): void{
        
    }
    protected onDestroy(): void{
        
    }

    public getGameWorld(): GameWorld{
        return this.gameObject!.getGameWorld();
    }

    public hasComponent<T extends Component>(classC: new (...args: any[]) => T): boolean{
        return this.gameObject.hasComponent(classC);
    }
    public getComponent<T extends Component>(classC: new (...args: any[]) => T): T{
        return this.gameObject.getComponent(classC);
    }
    public getAllComponents(): Component[]{
        return this.gameObject.getAllComponents();
    }

    public getTransform(): Transform{
        return this.gameObject.getTransform();
    }
    public getGameObject(): GameObject{
        return this.gameObject;
    }
    public isEnabled(): boolean{
        return this.gameObject.enabled&&this.enabled;
    }
    public enable(value=true): void{
        this.enabled=value;
    }
}