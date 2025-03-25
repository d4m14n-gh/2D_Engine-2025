import { Vector } from "../Helpers/Vector";
import { BarRendererC } from "./Renderers/BarRenderer";
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
            this.getTransform().scale = this.defaultZoom.times(1-fill);
            // ((this.gameObject.getAllComponents(c => c instanceof RendererC)[0]) as RendererC)
            // .color.a = (1-fill);
            if (this.hasComponent(BarRendererC))
                this.getComponent<BarRendererC>(BarRendererC).enable(false);
            this.shrinkProgress-=delta;
        }
        else if (this.shrinkProgress!=-1){
            this.getGameObject().destroy();
        }


        if(this.zoomProgress>0){
            let fill = (this.zoomDuration-this.zoomProgress)/this.zoomDuration;
            this.getTransform().scale = this.defaultZoom.times(1+Math.sin(Math.PI*fill)/5);
            this.zoomProgress-=delta;
        }
        else if(this.zoomProgress!=-1){
            this.zoomProgress=-1;
            this.getTransform().scale = this.defaultZoom;
        }
    }
    
    public startZoom(): void{
        if(this.zoomProgress==-1){
            this.defaultZoom = this.getTransform().scale.clone();
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