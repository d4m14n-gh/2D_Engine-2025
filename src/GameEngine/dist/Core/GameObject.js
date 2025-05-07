import { Transform } from "../Helpers/Transform";
export class GameObject {
    transform = new Transform();
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
        return this.components.get(type);
    }
    getAllComponents(onlyEnabled = false) {
        return Array.from(this.components.values()).filter(c => onlyEnabled ? c.isEnabled() : true);
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
