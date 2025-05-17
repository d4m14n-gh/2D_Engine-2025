import { ProfilerPlugin } from "../Plugins/Hud/Profiler";
import { Plugin } from "./Plugin";
import { GameEvent } from "./GameEvent";

export class GameWorld {
    private startTime: number=0;
    private prevWorldTime: number=0;
    private worldTime: number=0;
    private tickCount: number = 0;

    private plugins: Map<string, Plugin> = new Map<string, Plugin>();
    private events: Set<WeakRef<GameEvent>> = new Set<WeakRef<GameEvent>>();
    
    constructor(...plugins: Plugin[]){
        for(let plugin of plugins){
            let name = plugin.constructor.name;
            if (this.plugins.has(name))
                throw new Error(`Plugin ${name} already exists in the game object`);
                    
            (plugin as any).gameWorld = this;
            this.plugins.set(name, plugin);
        }
    }
    //plugins
    public getPlugin<T extends Plugin>(plugin: new (...args: any[]) => T): T {
        const name = plugin.name;
        return this.getPluginByName(name);
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

    public registerEvent(event: GameEvent): void{
        this.events.add(new WeakRef(event));
    }
    //time
    public getWorldTime(): number {
        return this.worldTime/1e3;
    }

    //flow control of components
    // 1. start / update
    // 2. event
    
    public tick(): void {
        this.tickCount++;
        if (this.tickCount == 1) 
            this.startWorld();
        else
            this.updateWorld();
        this.invokeEvents();
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
            if (!plugin.enabled)
                return;
            let start = performance.now(); 
            (plugin as any).update(delta/1e3);
            this.getPlugin(ProfilerPlugin).addRecord(plugin.name, performance.now()-start);
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
        this.getPlugin(ProfilerPlugin).addRecord("Events", performance.now()-start);
    }
    //overridable methods
    protected Start(): void { }
    protected Update(delta: number): void { }
}