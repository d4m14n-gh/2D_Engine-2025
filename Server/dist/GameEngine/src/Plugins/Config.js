"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigPlugin = void 0;
const Color_1 = require("../Helpers/Color");
const Plugin_1 = require("../Core/Plugin");
class ConfigPlugin extends Plugin_1.Plugin {
    static config = new Map([
        ["bulletSize", 0.75],
        ["displayColliders", false],
        // ["displayColliders", true as any],
        ["playerSize", 2.5],
        ["bulletColor", new Color_1.rgb(56, 57, 60)],
        // ["playerColor", new Color(145, 125, 39) as any],
        ["playerColor", new Color_1.rgb(80, 37, 36)],
        ["playerColor", new Color_1.rgb(129, 49, 54)],
        ["playerColor", new Color_1.rgb(59, 94, 76)],
        ["playerColor", new Color_1.rgb(122, 111, 62)],
        ["playerColor", new Color_1.rgb(130, 111, 51)],
    ]);
    static get(key) {
        if (!ConfigPlugin.config.has(key))
            return undefined;
        return ConfigPlugin.config.get(key);
    }
    static getNull(key) {
        if (!ConfigPlugin.config.has(key))
            return null;
        return ConfigPlugin.config.get(key);
    }
}
exports.ConfigPlugin = ConfigPlugin;
