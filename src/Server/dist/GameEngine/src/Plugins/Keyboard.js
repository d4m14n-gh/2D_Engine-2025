"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyboardPlugin = void 0;
const Plugin_1 = require("../Core/Plugin");
class KeyboardPlugin extends Plugin_1.Plugin {
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
exports.KeyboardPlugin = KeyboardPlugin;
