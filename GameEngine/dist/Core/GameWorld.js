import { ProfilerPlugin } from "../Plugins/Profiler";
export class GameWorld {
    gameObjects = new Set();
    plugins = new Map();
    tickCount = 0;
    // private toStart: Array<WeakRef<Component>> = [];
    constructor(...plugins) {
        for (let plugin of plugins) {
            let name = plugin.constructor.name;
            if (this.plugins.has(name))
                throw new Error(`Plugin ${name} already exists in the game object`);
            plugin.gameWorld = this;
            this.plugins.set(name, plugin);
        }
    }
    getPlugin(plugin) {
        const name = plugin.name;
        // if (!this.plugins.has(name))
        // throw new Error(`Plugin ${name} does'not exist in the game object`);
        return this.plugins.get(name);
    }
    hasPlugin(plugin) {
        const name = plugin.name;
        return this.plugins.has(name);
    }
    //game objects
    spawn(gameObject) {
        if (this.gameObjects.has(gameObject))
            throw new Error(`GameObject ${gameObject.name} already exists in the game world`);
        // gameObject.getAllComponents().forEach(comp => this.toStart.push(new WeakRef(comp)));
        gameObject.gameWorld = this;
        this.gameObjects.add(gameObject);
        gameObject.getAllComponents().forEach(cmp => cmp.onSpawn());
        return gameObject;
    }
    destroy(gameObject) {
        if (!this.gameObjects.has(gameObject))
            throw new Error(`GameObject ${gameObject.name} does'not exist in the game world`);
        gameObject.getAllComponents().forEach(cmp => cmp.onDestroy());
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
    //not optimalized
    getAllComponents(onlyEnabled = true) {
        return Array.from(this.getAllGameObjects(onlyEnabled)).flatMap(go => go.getAllComponents());
    }
    //main flow control
    startTime;
    prevTotal = 0;
    totalDelta = 0;
    getTotal() { return this.totalDelta / 1e3; }
    tick() {
        let delta = 0;
        const fixedDelta = 10;
        if (this.tickCount == 0) {
            setInterval(() => { this.worldFixedUpdate(fixedDelta / 1e3); }, fixedDelta);
            this.startTime = performance.now();
            this.WorldStart();
            this.plugins.forEach(plugin => plugin.start());
        }
        else {
            this.totalDelta = performance.now() - this.startTime;
            delta = this.totalDelta - this.prevTotal;
            this.prevTotal = this.totalDelta;
            this.worldUpdate(delta / 1e3);
            this.plugins.forEach(plugin => {
                let start = performance.now();
                plugin.update(delta / 1e3);
                this.getPlugin(ProfilerPlugin).addRecord(plugin.constructor.name, performance.now() - start);
            });
        }
        this.tickCount++;
    }
    WorldStart() {
        this.Start();
    }
    worldUpdate(delta) {
        this.Update(delta);
    }
    worldFixedUpdate(delta) {
        this.FixedUpdate(delta);
        this.plugins.forEach(plugin => plugin.fixedUpdate(delta));
    }
    //overridable methods
    Start() { }
    Update(delta) { }
    FixedUpdate(delta) { }
}
