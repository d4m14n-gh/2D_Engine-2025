import { Component } from "./Component";
import { GameObject } from "./GameObject";
import { WorldComponent } from "./WorldComponent";

export class GameWorld {
    private gameObjects: Set<GameObject> = new Set<GameObject>();
    private plugins: Map<string, WorldComponent> = new Map<string, WorldComponent>();
    private loopIteration: number = 0;
    
    constructor(...plugins: WorldComponent[]){
        for(let plugin of plugins){
            let name = plugin.constructor.name;
            if (this.plugins.has(name))
                throw new Error(`Plugin ${name} already exists in the game object`);
                    
            plugin.gameWorld = this;
            this.plugins.set(name, plugin);
        }

    }

    public getPlugin<T extends WorldComponent>(name: string): T{
        if (!this.plugins.has(name))
            throw new Error(`Plugin ${name} does'not exist in the game object`);

        return this.plugins.get(name) as T;
    }
    public hasPlugin(name: string): boolean{
        return this.plugins.has(name);
    }


    //game objects
    public spawn(gameObject: GameObject): void{
        if (this.gameObjects.has(gameObject))
            throw new Error(`GameObject ${gameObject.name} already exists in the game world`);

        gameObject.gameWorld = this;
        gameObject.getAllComponents().forEach(comp => comp.start());
        this.gameObjects.add(gameObject);
    }
    public destroy(gameObject: GameObject): void{
        if (!this.gameObjects.has(gameObject))
            throw new Error(`GameObject ${gameObject.name} does'not exist in the game world`);

        gameObject.enabled = false;
        this.gameObjects.delete(gameObject);
    }
    public getAllGameObjects(onlyEnabled: boolean=true): GameObject[]{
        return Array.from(this.gameObjects).filter(go=>go.enabled||!onlyEnabled);
    }

    //components
    public getComponents<T extends Component>(type: string, onlyEnabled: boolean=true): T[]{
        return this.getAllGameObjects()
        .filter(go => go.hasComponent(type)&&(go.getComponent(type).enabled||!onlyEnabled))
        .map(go => go.getComponent<T>(type));
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
        this.worldUpdate(delta/1e3, this.totalDelta/1e3);
        this.loopIteration++;
    }
    private startInterval(): void{
        let interval: any;
        let fixedDelta: number = 7;
        interval = setInterval(() => {this.worldFixedUpdate(fixedDelta/1e3, (performance.now() - this.startTime)/1e3) }, fixedDelta);
    }
    
    private worldStart(): void {
        this.plugins.forEach(plugin => plugin.start());
        this.Start();            
    }
    private worldUpdate(delta: number, totalDelta: number): void { 
        this.plugins.forEach(plugin => plugin.update(delta, totalDelta));
        this.Update(delta, totalDelta);        
        
    }
    private worldFixedUpdate(delta: number, totalDelta: number): void {
        this.plugins.forEach(plugin => plugin.fixedUpdate(delta, totalDelta));
        this.FixedUpdate(delta, totalDelta);
    }
    //overridable methods
    protected Start(): void { }
    protected Update(delta: number, totalDelta: number): void { }
    protected FixedUpdate(delta: number, totalDelta: number): void { }
}