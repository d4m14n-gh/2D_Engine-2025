"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plugin = void 0;
//WorldComponent = Plugin
class Plugin {
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
exports.Plugin = Plugin;
