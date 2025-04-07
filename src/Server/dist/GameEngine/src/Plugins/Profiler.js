"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilerPlugin = void 0;
const Vector_1 = require("../Helpers/Vector");
const Plugin_1 = require("../Core/Plugin");
const Renderer_1 = require("./Renderer");
class ProfilerPlugin extends Plugin_1.Plugin {
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
                // for(let i=0;i<len-1;i++)
                // usage[i]=usage[i+1];
                // usage[len-1]=value;
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
            this.getPlugin(Renderer_1.RendererPlugin).hud.setLabel(key, new Vector_1.Vector(40, i * 40), `${key}: ` + (mean).toFixed(2).toString());
        }
    }
}
exports.ProfilerPlugin = ProfilerPlugin;
