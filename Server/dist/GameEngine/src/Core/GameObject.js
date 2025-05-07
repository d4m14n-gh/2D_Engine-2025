"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameObject = void 0;
const Transform_1 = require("../Helpers/Transform");
class GameObject {
    transform = new Transform_1.Transform();
    // private id: number = 0;
    components = new Map();
    enabled = true;
    name = "UnnamedGameObject";
    gameWorld;
    constructor(...components) {
        for (let component of components) {
            let name = component.constructor.name;
            if (this.components.has(name))
                throw new Error(`Component ${name} already exists in the game object`);
            component.gameObject = this;
            this.components.set(name, component);
        }
    }
    hasComponent(classC) {
        return this.components.has(classC.name);
    }
    getComponent(classC) {
        const type = classC.name;
        //if (!this.components.has(type))
        // throw new Error(`Component doesn't ${type} exists in the game object`);
        return this.components.get(type);
    }
    getAllComponents() {
        return Array.from(this.components.values()).filter(c => c.isEnabled());
    }
    destroy() {
        this.gameWorld.destroy(this);
    }
    spawn(gameWorld) {
        return gameWorld.spawn(this);
    }
    getTransform() {
        return this.transform;
    }
    getGameWorld() {
        return this.gameWorld;
    }
}
exports.GameObject = GameObject;
