//WorldComponent = Plugin
export class Plugin {
    gameWorld;
    enabled = true;
    constructor() {
    }
    //overideable methods
    start() { }
    update(delta) { }
    fixedUpdate(delta) { }
    getPlugin(plugin) {
        return this.gameWorld.getPlugin(plugin);
    }
    hasPlugin(plugin) {
        return this.gameWorld.hasPlugin(plugin);
    }
}
