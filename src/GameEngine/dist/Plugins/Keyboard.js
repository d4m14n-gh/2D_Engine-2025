import { Plugin } from "../Core/Plugin";
export class KeyboardPlugin extends Plugin {
    pressedKeys = new Set();
    ;
    constructor(pressedKeys) {
        super();
        this.pressedKeys = pressedKeys;
    }
    isKeyDown(key) {
        return this.pressedKeys.has(key);
    }
}
