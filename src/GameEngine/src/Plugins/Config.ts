import { Color } from "../Helpers/Color";
import { WorldComponent } from "../WorldComponent";

export class ConfigPlugin extends WorldComponent{
    private static readonly config: Map<string, any> = new Map(
        [
            ["bulletSize", 0.75 as any],
            // ["displayColliders", false as any],
            ["displayColliders", true as any],
            ["playerSize", 2.75 as any],
            ["bulletColor", new Color(56, 57, 60) as any],
            ["playerColor", new Color(145, 125, 39) as any],
        ]
    );
    public static get(key: string): any{
        if (!ConfigPlugin.config.has(key))
            return undefined;

        return ConfigPlugin.config.get(key);
    }
}