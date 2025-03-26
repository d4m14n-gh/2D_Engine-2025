import { Component } from "./Component";
import { GameObject } from "../Core/GameObject";
import { ProfilerPlugin } from "../Plugins/Profiler";
import { Plugin } from "./Plugin";

export class GameWorld {
    private gameObjects: Set<GameObject> = new Set<GameObject>();
    private plugins: Map<string, Plugin> = new Map<string, Plugin>();
    private tickCount: number = 0;
    // private toStart: Array<WeakRef<Component>> = [];
    
    constructor(...plugins: Plugin[]){
        for(let plugin of plugins){
            let name = plugin.constructor.name;
            if (this.plugins.has(name))
                throw new Error(`Plugin ${name} already exists in the game object`);
                    
            plugin.gameWorld = this;
            this.plugins.set(name, plugin);
        }

    }

    public getPlugin<T extends Plugin>(plugin: new (...args: any[]) => T): T{
        const name = plugin.name;
        // if (!this.plugins.has(name))
            // throw new Error(`Plugin ${name} does'not exist in the game object`);
        
        return this.plugins.get(name) as T;
    }
    public hasPlugin<T extends Plugin>(plugin: new (...args: any[]) => T): boolean{
        const name = plugin.name;
        return this.plugins.has(name);
    }


    //game objects
    public spawn(gameObject: GameObject): GameObject{
        if (this.gameObjects.has(gameObject))
            throw new Error(`GameObject ${gameObject.name} already exists in the game world`);

        // gameObject.getAllComponents().forEach(comp => this.toStart.push(new WeakRef(comp)));
        (gameObject as any).gameWorld = this;
        this.gameObjects.add(gameObject);
        gameObject.getAllComponents().forEach(cmp => (cmp as any).onSpawn());
        return gameObject;
    }
    public destroy(gameObject: GameObject): void{
        if (!this.gameObjects.has(gameObject))
            throw new Error(`GameObject ${gameObject.name} does'not exist in the game world`);
        
        gameObject.getAllComponents().forEach(cmp => (cmp as any).onDestroy());
        gameObject.enabled=false;
        this.gameObjects.delete(gameObject);
    }
    public getAllGameObjects(onlyEnabled: boolean=true): GameObject[]{
        return Array.from(this.gameObjects).filter(go=>go.enabled||!onlyEnabled);
    }

    //components
    public getComponents<T extends Component>(classC: new (...args: any[]) => T, onlyEnabled: boolean=true): T[]{
        return this.getAllGameObjects()
        .filter(go => go.hasComponent(classC)&&(go.getComponent(classC).isEnabled()||!onlyEnabled))
        .map(go => go.getComponent(classC));
    }
    //not optimalized
    public getAllComponents(onlyEnabled: boolean=true): Component[]{
        return Array.from(this.getAllGameObjects(onlyEnabled)).flatMap(go => go.getAllComponents());
    }



    //main flow control
    private startTime!: number;
    private prevTotal: number=0;
    private totalDelta: number=0;
    public getTotal(): number {return this.totalDelta/1e3}
   
    public tick(): void {
        let delta = 0
        const fixedDelta: number = 10;
        if (this.tickCount == 0) {
            setInterval(() => {this.worldFixedUpdate(fixedDelta/1e3) }, fixedDelta);
            this.startTime = performance.now();
            this.WorldStart();

            this.plugins.forEach(plugin => (plugin as any).start());
        }
        else{
            this.totalDelta = performance.now() - this.startTime;
            delta = this.totalDelta - this.prevTotal;
            this.prevTotal = this.totalDelta;
            this.worldUpdate(delta / 1e3);

            this.plugins.forEach(plugin => {
                let start = performance.now(); 
                (plugin as any).update(delta/1e3);
                this.getPlugin(ProfilerPlugin).addRecord(plugin.constructor.name, performance.now()-start);
            });
        }
        this.tickCount++;
    }
    
    
    private WorldStart(): void {
        this.Start();
    }
    private worldUpdate(delta: number): void { 
        this.Update(delta);        
    }
    private worldFixedUpdate(delta: number): void {
        this.FixedUpdate(delta);
        this.plugins.forEach(plugin => (plugin as any).fixedUpdate(delta));
    }
    
    //overridable methods
    protected Start(): void { }
    protected Update(delta: number): void { }
    protected FixedUpdate(delta: number): void { }
}