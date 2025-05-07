import { Vector } from "../Helpers/Vector";
import { Plugin } from "../Core/Plugin";
import { RendererPlugin } from "./Renderer";
export class ProfilerPlugin extends Plugin {
    name = "ProfilerPlugin";
    size = 200;
    usage = new Map();
    constructor() {
        super();
    }
    addRecord(key, value) {
        if (!this.usage.has(key)) {
            this.usage.set(key, [value]);
        }
        else {
            let usage = this.usage.get(key);
            let len = usage.length;
            if (len >= this.size) {
                usage.shift();
                usage.push(value);
            }
            else {
                usage.push(value);
            }
        }
    }
    update(delta) {
        let i = 0;
        for (const element of this.usage) {
            let key = element[0];
            let len = element[1].length;
            let mean = 0;
            for (const v of element[1])
                mean += v;
            mean /= len;
            i++;
            this.getPlugin(RendererPlugin).hud.setLabel(key, new Vector(40, i * 40), `${key}: ` + (mean).toFixed(2).toString() + "ms");
        }
    }
}
