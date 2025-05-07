import { ProfilerPlugin } from "../Plugins/Profiler";
export class GameWorld {
    startTime = 0;
    prevWorldTime = 0;
    worldTime = 0;
    tickCount = 0;
    gameObjects = new Set();
    plugins = new Map();
    events = new Set();
    componentsToStart = [];
    constructor(...plugins) {
        for (let plugin of plugins) {
            let name = plugin.constructor.name;
            if (this.plugins.has(name))
                throw new Error(`Plugin ${name} already exists in the game object`);
            plugin.gameWorld = this;
            this.plugins.set(name, plugin);
        }
    }
    //plugins
    getPlugin(plugin) {
        const name = plugin.name;
        return this.plugins.get(name);
    }
    getAllPlugins() {
        return Array.from(this.plugins.values());
    }
    hasPlugin(plugin) {
        const name = plugin.name;
        return this.plugins.has(name);
    }
    //game objects
    isSpawned(gameObject) {
        return this.gameObjects.has(gameObject);
    }
    spawn(gameObject) {
        if (this.gameObjects.has(gameObject))
            throw new Error(`GameObject ${gameObject.name} already exists in the game world`);
        gameObject.gameWorld = this;
        this.gameObjects.add(gameObject);
        gameObject.getAllComponents().forEach(comp => this.componentsToStart.push(new WeakRef(comp)));
        return gameObject;
    }
    destroy(gameObject) {
        if (!this.gameObjects.has(gameObject))
            throw new Error(`GameObject ${gameObject.name} does'not exist in the game world`);
        gameObject.enabled = false;
        this.gameObjects.delete(gameObject);
    }
    getAllGameObjects(onlyEnabled = true) {
        return Array.from(this.gameObjects).filter(go => go.enabled || !onlyEnabled);
    }
    //components
    getComponents(classC, onlyEnabled = true) {
        return this.getAllGameObjects()
            .filter(go => go.hasComponent(classC) && (go.getComponent(classC).isEnabled() || !onlyEnabled))
            .map(go => go.getComponent(classC));
    }
    getAllComponents(onlyEnabled = true) {
        //to do optimalization
        //not optimalized
        return Array.from(this.getAllGameObjects(onlyEnabled)).flatMap(go => go.getAllComponents());
    }
    //events
    registerEvent(event) {
        this.events.add(new WeakRef(event));
    }
    //time
    getWorldTime() {
        return this.worldTime / 1e3;
    }
    //flow control
    tick() {
        this.tickCount++;
        if (this.tickCount == 1)
            this.startWorld();
        else
            this.updateWorld();
        this.startComponents();
        this.invokeEvents();
    }
    fixedTick() {
        this.fixedUpdateWorld();
    }
    startComponents() {
        for (let componentRef of this.componentsToStart) {
            const component = componentRef.deref();
            if (component)
                component.start();
        }
        this.componentsToStart = [];
    }
    startWorld() {
        this.startTime = performance.now();
        this.Start();
        this.plugins.forEach(plugin => plugin.start());
    }
    updateWorld() {
        this.worldTime = performance.now() - this.startTime;
        const delta = this.worldTime - this.prevWorldTime;
        this.prevWorldTime = this.worldTime;
        this.Update(delta / 1e3);
        this.plugins.forEach(plugin => {
            if (!plugin.isEnabled())
                return;
            let start = performance.now();
            plugin.update(delta / 1e3);
            this.getPlugin(ProfilerPlugin).addRecord(plugin.name, performance.now() - start);
        });
    }
    fixedUpdateWorld() {
        const delta = 10 / 1e3;
        this.FixedUpdate(delta);
        this.plugins.forEach(plugin => {
            if (!plugin.isEnabled())
                return;
            plugin.fixedUpdate(delta);
        });
    }
    invokeEvents() {
        let start = performance.now();
        for (const eventRef of this.events) {
            const event = eventRef.deref();
            if (event)
                event.invoke();
            else
                this.events.delete(eventRef);
        }
        this.getPlugin(ProfilerPlugin).addRecord("Events", performance.now() - start);
    }
    //overridable methods
    Start() { }
    Update(delta) { }
    FixedUpdate(delta) { }
}
