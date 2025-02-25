import { RendererC } from "../Components/Renderers/Renderer";
import { Vector } from "../Helpers/Vector";
import { WorldComponent } from "../WorldComponent";
import { CameraPlugin } from "./Camera";
import { RendererPlugin } from "./Renderer";

export class ProfilerPlugin extends WorldComponent {
    public size: number = 200;
    private readonly usage = new Map<string, Array<number>>();


    constructor() {
        super();
    }

    public addRecord(key: string, value: number){
        if(!this.usage.has(key)){
            this.usage.set(key, [value]);
        }
        else {
            let usage = this.usage.get(key)!; 
            let len = usage.length;
            if (len >= this.size){
                for(let i=0;i<len-1;i++)
                    usage[i]=usage[i+1];
                usage[len-1]=value;
            }
            else{
                usage.push(value);
            }
        }
    }

    override update(delta: number, totalDelta: number): void {
        let i = 0;
        for (const element of this.usage) {
            let key = element[0];
            let len = element[1].length;
            let mean = 0;
            for (const v of element[1])
                mean += v;
            mean/=len;    

            i++;
            this.gameWorld.getPlugin<RendererPlugin>(RendererPlugin.name).hud.setLabel(key, new Vector(40, i*40), `${key}: `+(mean).toFixed(2).toString());
                
        }
    }
    
 
}