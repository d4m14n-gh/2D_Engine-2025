"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Component = void 0;
class Component {
    enabled = true;
    gameObject;
    onSpawn() {
    }
    onDestroy() {
    }
    onEvent(key, args) {
        console.log("Event received", args);
    }
    getGameWorld() {
        return this.gameObject.getGameWorld();
    }
    hasComponent(classC) {
        return this.gameObject.hasComponent(classC);
    }
    getComponent(classC) {
        return this.gameObject.getComponent(classC);
    }
    getAllComponents() {
        return this.gameObject.getAllComponents();
    }
    getTransform() {
        return this.gameObject.getTransform();
    }
    getGameObject() {
        return this.gameObject;
    }
    isEnabled() {
        return this.gameObject.enabled && this.enabled;
    }
    enable(value = true) {
        this.enabled = value;
    }
}
exports.Component = Component;
