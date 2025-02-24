import { Color } from "../../Helpers/Color";
import { CameraPlugin } from "../../Plugins/Camera";
import { RendererC } from "./Renderer";

export class TextRendererC extends RendererC {
    public color: Color = new Color(42, 42, 55);
    public text: string;
    public displayName: boolean;

    constructor(text: string, displayName: boolean = false, zindex: number=1){
        super();
        this.text = text;
        this.zindex = zindex;
        this.displayName = displayName;
    }

    public render(context: CanvasRenderingContext2D): void {
     
        const size = [context.canvas.width, context.canvas.height];
        const x = this.gameObject.transform.position.x;
        const y = this.gameObject.transform.position.y;
        const r = this.gameObject.transform.rotation;
        const transformScale = this.gameObject.transform.scale;
        const scale = this.gameObject.gameWorld.getPlugin<CameraPlugin>(CameraPlugin.name).scale;

        const cmx = this.gameObject.gameWorld.getPlugin<CameraPlugin>(CameraPlugin.name).cameraPositon.x;
        const cmy = this.gameObject.gameWorld.getPlugin<CameraPlugin>(CameraPlugin.name).cameraPositon.y;
        const color = this.color.toString();
        
        const cx: number = (x-cmx);
        const cy: number = -(y-cmy);


        context.save();
        
        context.fillStyle = color;
        context.translate(size[0]/2, size[1]/2);
        context.scale(scale, scale);
        context.translate(cx, cy);
        // context.rotate(r);
        context.scale(transformScale.x, transformScale.y);
        
        
        
        // context.shadowBlur = 0;
        // context.fillRect(-a, -a, 2*a, 2*a);
        // context.shadowBlur = 30;
        // context.strokeRect(-a, -a, 2*a, 2*a);

    
        
        
        const text = this.displayName?this.gameObject.name:this.text;
        const textHeight = 1.0;
        context.font = "bold "+textHeight+"px Arial";
        context.fillStyle = "azure";
        const offset = context.measureText(text).width/2;
        context.strokeText(text, -offset, textHeight/4);
        context.fillText(text, -offset, textHeight/4);

        context.restore();
    }
}