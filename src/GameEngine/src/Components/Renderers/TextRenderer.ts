import { rgb } from "../../Helpers/Color";
import { Vector } from "../../Helpers/Vector";
import { CameraPlugin } from "../../Plugins/Camera";
import { RendererC } from "./Renderer";

export class TextRendererC extends RendererC {
    public color: rgb = new rgb(42, 42, 55);
    public text: string;
    public displayName: boolean;

    constructor(text: string, displayName: boolean = false, zindex: number=1){
        super();
        this.text = text;
        this.zindex = zindex;
        this.displayName = displayName;
    }

    public render(context: CanvasRenderingContext2D): void {
        const camera = this.getPlugin(CameraPlugin)!;
        const body = this.gameObject!.getBody()!;
        const offset = camera.cameraScreenOffset;
        const x = body.getPosition().x;
        const y = body.getPosition().y;
        const r = body.getRotation();
        const transformScale = new Vector(1, 1); //body.getScale();
        const scale = camera.scaleV;

        const cmx = camera.cameraPosition.x;
        const cmy = camera.cameraPosition.y;
        const color = this.color.toString();
        
        const cx: number = (x-cmx);
        const cy: number = (y-cmy);


        // context.save();
        
        context.fillStyle = color;
        context.translate(offset.x, offset.y);
        context.scale(scale.x, scale.y);
        context.translate(cx, cy);
        // context.rotate(r);
        context.scale(transformScale.x, transformScale.y);
        context.scale(1, -1);
        
        
        
        // context.fillRect(-a, -a, 2*a, 2*a);
        // context.shadowBlur = 30;
        // context.strokeRect(-a, -a, 2*a, 2*a);

    
        
        
        const text = this.displayName?this.gameObject!.name:this.text;
        const textHeight = 1.0;
        context.font = "bold "+textHeight+"px Arial";
        context.fillStyle = "azure";
        context.shadowBlur = 10;
        const textOffset = context.measureText(text).width/2;
        context.strokeText(text, -textOffset, textHeight/4);
        context.fillText(text, -textOffset, textHeight/4);

        context.shadowBlur = 0;
        context.setTransform(1, 0, 0, 1, 0, 0);
        // context.restore();
    }
}