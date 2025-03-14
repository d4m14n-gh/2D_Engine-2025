import { rgb as rgb } from "../Helpers/Color";
import { Plugin } from "../Plugin";

export class ConfigPlugin extends Plugin{
    private static readonly config: Map<string, any> = new Map(
        [
            ["bulletSize", 0.75 as any],
            ["displayColliders", false as any],
            // ["displayColliders", true as any],
            ["playerSize", 2.5 as any],
            ["bulletColor", new rgb(56, 57, 60) as any],
            // ["playerColor", new Color(145, 125, 39) as any],
            ["playerColor", new rgb(80, 37, 36) as any],
            ["playerColor", new rgb(129, 49, 54) as any],
            ["playerColor", new rgb(59, 94, 76) as any],
            ["playerColor", new rgb(122, 111, 62) as any],
            ["playerColor", new rgb(130, 111, 51) as any],
        ]
    );
    public static get(key: string): any{
        if (!ConfigPlugin.config.has(key))
            return undefined;

        return ConfigPlugin.config.get(key);
    }
    public static getNull(key: string): any{
        if (!ConfigPlugin.config.has(key))
            return null;

        return ConfigPlugin.config.get(key);
    }
}