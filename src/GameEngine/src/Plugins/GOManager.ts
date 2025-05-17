import { Vector } from "../Helpers/Vector";
import { Plugin } from "../Core/Plugin";
import { GameObject } from "../Core/GameObject";
import { Component } from "../Core/Component";


export class GOManagerPlugin extends Plugin {
    public name: string = "GameObjects";
    private gameObjects: Map<string, any> = new Map<string, any>();

    public getGameObject(id: string): GameObject | undefined {
        return this.gameObjects.get(id);    
    }
    
    override start(): void {
        for(let gameObject of this.gameObjects.values())
            (gameObject as any).start();
    }

    //spawning
    public isSpawned(gameObject: GameObject): boolean {
        return this.gameObjects.has(gameObject.id);
    }
    public spawn(gameObject: GameObject): void {
        this.gameObjects.set(gameObject.id, gameObject);
        (gameObject as any).manager = this;
        (gameObject as any).spawn();
    }
    public destroy(gameObject: GameObject): void {
        (gameObject as any).destroy();
        (gameObject as any).manager = undefined;
        this.gameObjects.delete(gameObject.id);
    }

    public getComponents<T extends Component>(classC: new (...args: any[]) => T): T[]{
        return Array.from(this.gameObjects.values().flatMap(go => go.getComponents(classC)));
    }
    public getAllComponents(): Component[]{
        return Array.from(this.gameObjects.values().flatMap(go => go.getAllComponents()));
    }
}