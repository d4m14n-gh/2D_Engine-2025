import { EventArgs, GameEvent } from "../Core/GameEvent";
import { Plugin } from "../Core/Plugin";
export class KeyboardEventArgs extends EventArgs {
    key;
    constructor(key) {
        super();
        this.key = key;
    }
}
export class KeyboardPlugin extends Plugin {
    name = "KeyboardPlugin";
    prevPressedKeys = new Set();
    pressedKeys = new Set();
    KeyDownEvent = new GameEvent();
    constructor(pressedKeys) {
        super();
        this.pressedKeys = pressedKeys;
    }
    isPressed(key) {
        return this.pressedKeys.has(key);
    }
    start() {
        this.KeyDownEvent.register(this.gameWorld);
    }
    update(delta) {
        this.pressedKeys.difference(this.prevPressedKeys).forEach(key => this.KeyDownEvent.emit(new KeyboardEventArgs(key)));
        this.prevPressedKeys.clear();
        this.pressedKeys.forEach(key => this.prevPressedKeys.add(key));
    }
}
