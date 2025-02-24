import { Component } from "../Component";
import { GameObject } from "../GameObject";
import { Vector } from "../Helpers/Vector";
import { BarRendererC } from "./Renderers/BarRenderer";
import { RendererC } from "./Renderers/Renderer";
import { StandaloneComponent } from "./StandaloneComponent";

export class AnimationC extends StandaloneComponent {
    private zoomProgress: number = -1;
    public zoomDuration: number = 0.25;
    
    private shrinkProgress: number = -1;
    public shrinkDuration: number = 0.5;
    
    constructor(){
        super();
    }
    
    private defaultZoom: Vector = new Vector(1, 1);
    override update(delta: number): void {
        if(this.shrinkProgress>0){
            let fill = (this.shrinkDuration-this.shrinkProgress)/this.shrinkDuration;
            this.gameObject.transform.scale = this.defaultZoom.times(1-fill);
            // ((this.gameObject.getAllComponents(c => c instanceof RendererC)[0]) as RendererC)
            // .color.a = (1-fill);
            if (this.gameObject.hasComponent(BarRendererC.name))
                this.gameObject.getComponent<BarRendererC>(BarRendererC.name).enabled = false;
            this.shrinkProgress-=delta;
        }
        else if (this.shrinkProgress!=-1){
            this.gameObject.destroy();
        }


        if(this.zoomProgress>0){
            let fill = (this.zoomDuration-this.zoomProgress)/this.zoomDuration;
            this.gameObject.transform.scale = this.defaultZoom.times(1+Math.sin(Math.PI*fill)/5);
            this.zoomProgress-=delta;
        }
        else if(this.zoomProgress!=-1){
            this.zoomProgress=-1;
            this.gameObject.transform.scale = this.defaultZoom;
        }
    }
    
    public startZoom(): void{
        if(this.zoomProgress==-1){
            this.defaultZoom = this.gameObject.transform.scale.clone();
            this.zoomProgress=this.zoomDuration;
        }
        else
            this.zoomProgress=(this.zoomDuration+this.zoomProgress)/2;
    }
    public startShrink(): void{
        if (this.shrinkProgress==-1)
            this.shrinkProgress=this.shrinkDuration;
    }
} 