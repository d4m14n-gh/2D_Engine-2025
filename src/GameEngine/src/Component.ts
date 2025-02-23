import { GameObject } from "./GameObject";
import { GameWorld } from "./GameWorld";
import { Transform } from "./Helpers/Transform";
import { WorldComponent } from "./WorldComponent";

export abstract class Component {
    enabled: boolean = true;
    
    gameObject!: GameObject;
    
    public start(): void{
        
    }

    protected getGW(): GameWorld{
        return this.gameObject!.gameWorld;
    }
    protected getT(): Transform{
        return this.gameObject!.transform;
    }
}