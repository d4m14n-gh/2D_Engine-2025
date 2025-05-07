export class Component {
    enabled = true;
    gameObject;
    //overideable methods
    start() { }
    event(args, alias) { }
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
    getPlugin(plugin) {
        return this.getGameWorld().getPlugin(plugin);
    }
    isEnabled() {
        return this.gameObject.enabled && this.enabled;
    }
    enable(value = true) {
        this.enabled = value;
    }
}
