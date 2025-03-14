import { Component } from "./Component";
import { GameObject } from "./GameObject";
import { ProfilerPlugin } from "./Plugins/Profiler";
import { Plugin } from "./Plugin";

export class GameWorld {
    private gameObjects: Set<GameObject> = new Set<GameObject>();
    private plugins: Map<string, Plugin> = new Map<string, Plugin>();
    private loopIteration: number = 0;
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
        if (!this.plugins.has(name))
            throw new Error(`Plugin ${name} does'not exist in the game object`);
        
        return this.plugins.get(name) as T;
    }
    public hasPlugin<T extends Plugin>(plugin: new (...args: any[]) => T): boolean{
        const name = plugin.name;
        return this.plugins.has(name);
    }


    //game objects
    public spawn(gameObject: GameObject): void{
        if (this.gameObjects.has(gameObject))
            throw new Error(`GameObject ${gameObject.name} already exists in the game world`);

        // gameObject.getAllComponents().forEach(comp => this.toStart.push(new WeakRef(comp)));
        (gameObject as any).gameWorld = this;
        this.gameObjects.add(gameObject);
        gameObject.getAllComponents().forEach(cmp => (cmp as any).onSpawn());
    }
    public destroy(gameObject: GameObject): void{
        if (!this.gameObjects.has(gameObject))
            throw new Error(`GameObject ${gameObject.name} does'not exist in the game world`);
        
        gameObject.getAllComponents().forEach(cmp => (cmp as any).onDestroy());
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
    public nextLoop(): void {
        if (this.loopIteration == 0) {
            this.startTime = performance.now();
            this.worldStart();
            this.startInterval();
        }
        this.totalDelta = performance.now() - this.startTime;
        const delta = this.totalDelta - this.prevTotal;
        this.prevTotal = this.totalDelta;
        this.worldUpdate(delta/1e3);
        this.loopIteration++;
    }
    private startInterval(): void{
        let fixedDelta: number = 10;
        setInterval(() => {this.worldFixedUpdate(fixedDelta/1e3, (performance.now() - this.startTime)/1e3) }, fixedDelta);
    }
    
    private worldStart(): void {
        this.plugins.forEach(plugin => plugin.start());
        this.Start();            
    }
    private worldUpdate(delta: number): void { 
        // while(this.toStart.length>0){
        //     let last = this.toStart[this.toStart.length-1];
        //     last.deref()?.onSpawn();
        //     this.toStart.pop();
        // }
        this.plugins.forEach(
            (plugin, key) => {
                let start = performance.now(); 
                plugin.update(delta);
                this.getPlugin(ProfilerPlugin).addRecord(key, performance.now()-start);
            } 
        );
        this.Update(delta);        
        
    }
    private worldFixedUpdate(delta: number, totalDelta: number): void {
        this.plugins.forEach(plugin => plugin.fixedUpdate(delta));
        this.FixedUpdate(delta);
    }
    //overridable methods
    protected Start(): void { }
    protected Update(delta: number): void { }
    protected FixedUpdate(delta: number): void { }
}