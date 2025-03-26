import { rgb as rgb } from "../Helpers/Color";
import { Plugin } from "../Core/Plugin";
export class ConfigPlugin extends Plugin {
    static config = new Map([
        ["bulletSize", 0.75],
        ["displayColliders", false],
        // ["displayColliders", true as any],
        ["playerSize", 2.5],
        ["bulletColor", new rgb(56, 57, 60)],
        // ["playerColor", new Color(145, 125, 39) as any],
        ["playerColor", new rgb(80, 37, 36)],
        ["playerColor", new rgb(129, 49, 54)],
        ["playerColor", new rgb(59, 94, 76)],
        ["playerColor", new rgb(122, 111, 62)],
        ["playerColor", new rgb(130, 111, 51)],
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
