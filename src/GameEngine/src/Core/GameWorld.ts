import { Component } from "./Component";
import { GameObject } from "../Core/GameObject";
import { ProfilerPlugin } from "../Plugins/Hud/Profiler";
import { Plugin } from "./Plugin";
import { GameEvent } from "./GameEvent";

export class GameWorld {
    private startTime: number=0;
    private prevWorldTime: number=0;
    private worldTime: number=0;
    private tickCount: number = 0;

    private gameObjects: Map<string, GameObject> = new Map<string, GameObject>();
    private plugins: Map<string, Plugin> = new Map<string, Plugin>();
    private events: Set<WeakRef<GameEvent>> = new Set<WeakRef<GameEvent>>();
    private componentsToStart: Array<WeakRef<Component>> = [];
    
    constructor(...plugins: Plugin[]){
        plugins.sort((a, b) => a.order - b.order);
        for(let plugin of plugins){
            let name = plugin.constructor.name;
            if (this.plugins.has(name))
                throw new Error(`Plugin ${name} already exists in the game object`);
                    
            (plugin as any).gameWorld = this;
            this.plugins.set(name, plugin);
        }
    }
    //plugins
    public tryGetPlugin<T extends Plugin>(plugin: new (...args: any[]) => T): T | undefined {
        const name = plugin.name;
        if (!this.plugins.has(name))
            return undefined;
        return this.plugins.get(name) as T;
    }
    public getPlugin<T extends Plugin>(plugin: new (...args: any[]) => T): T {
        const name = plugin.name;
        if (!this.plugins.has(name))
            throw new Error(`Plugin ${name} does not exist in the game world`);
        return this.plugins.get(name) as T;
    }
    public getPluginByName<T extends Plugin>(name: string): T {
        if (!this.plugins.has(name))
            throw new Error(`Plugin ${name} does not exist in the game world`);
        return this.plugins.get(name) as T;
    }
    public getAllPlugins(): Plugin[]{
        return Array.from(this.plugins.values());
    }
    public hasPlugin<T extends Plugin>(plugin: new (...args: any[]) => T): boolean{
        const name = plugin.name;
        return this.plugins.has(name);
    }


    //game objects
    public isSpawned(gameObject: GameObject): boolean{
        return  this.gameObjects.has(gameObject.getId());
    }
    public spawn(gameObject: GameObject): GameObject{
        if (this.gameObjects.has(gameObject.getId()))
            throw new Error(`GameObject ${gameObject.name} already exists in the game world`);

        (gameObject as any).gameWorld = this;
        this.gameObjects.set(gameObject.getId(), gameObject);

        gameObject.getAllComponents().forEach(comp => this.componentsToStart.push(new WeakRef(comp)));
        return gameObject;
    }
    public destroy(gameObject?: GameObject): void{
        if (!gameObject) return;
        if (!this.gameObjects.has(gameObject.getId()))
            throw new Error(`GameObject ${gameObject.name} does'not exist in the game world`);
        (gameObject as any).gameWorld = undefined;

        gameObject.enabled=false;
        this.gameObjects.delete(gameObject.getId());
    }
    public hasGameObject(id: string): boolean {
        return this.gameObjects.has(id);
    }
    public getGameObject(id: string): GameObject | undefined {
        return this.gameObjects.get(id);
    }
    public getAllGameObjects(onlyEnabled: boolean=true): GameObject[]{
        return Array.from(this.gameObjects.values()).filter(go=>go.enabled||!onlyEnabled);
    }

    //components
    public getComponents<T extends Component>(classC: new (...args: any[]) => T, onlyEnabled: boolean=true): T[]{
        return this.getAllGameObjects()
        .filter(go => go.hasComponent(classC)&&(go.getComponent(classC)!.isEnabled()||!onlyEnabled))
        .map(go => go.getComponent(classC)!);
    }
    public getAllComponents(onlyEnabled: boolean=true): Component[]{
        //todo optimalization
        //not optimalized
        return Array.from(this.getAllGameObjects(onlyEnabled)).flatMap(go => go.getAllComponents());
    }
    //events
    public registerEvent(event: GameEvent): void{
        this.events.add(new WeakRef(event));
    }
    //time
    public getWorldTime(): number {
        return this.worldTime/1e3;
    }



    //flow control
    public tick(): void {
        this.tickCount++;
        if (this.tickCount == 1) 
            this.startWorld();
        else
            this.updateWorld();

        this.startComponents();
        this.invokeEvents();
    }
    private startComponents(): void{
        for (let componentRef of this.componentsToStart) {
            const component = componentRef.deref();
            if (component)
                (component as any).start();
        }
        this.componentsToStart = [];
    }
    private startWorld(): void{
        this.startTime = performance.now();
        this.Start();
        this.plugins.forEach(plugin => (plugin as any).start());
    }
    private updateWorld(): void{
        this.worldTime = performance.now() - this.startTime;
        const delta = this.worldTime - this.prevWorldTime;
        this.prevWorldTime = this.worldTime;
       
        this.Update(delta / 1e3);
        this.plugins.forEach(plugin => {
            if (!plugin.isEnabled())
                return;
            let start = performance.now(); 
            (plugin as any).update(delta/1e3);
            this.tryGetPlugin(ProfilerPlugin)?.addRecord(plugin.name, performance.now()-start);
        });
    }

    private invokeEvents(): void{
        let start = performance.now();
        for (const eventRef of this.events) {
            const event = eventRef.deref();
            if (event)
                (event as any).invoke();
            else
                this.events.delete(eventRef);
        }
        this.tryGetPlugin(ProfilerPlugin)?.addRecord("Events", performance.now()-start);
    }
    //overridable methods
    protected Start(): void { }
    protected Update(delta: number): void { }
}