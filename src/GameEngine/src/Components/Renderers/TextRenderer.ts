import { rgb } from "../../Helpers/Color";
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
        const world = this.getGameWorld();
        const transform = this.getTransform();
        const camera = this.getPlugin(CameraPlugin);
        if (!world || !transform || !camera) return;


        const x = transform.position.x;
        const y = transform.position.y;
        const r = transform.rotation;
        const scale = transform.scale;
        
        const color: string = this.color.toString();
        const text: string = this.displayName?this.getGameObject()?.name??this.text:this.text;

        context.setTransform(camera.getCameraTransform());
        context.translate(x, y);
        // context.rotate(r);
        context.scale(scale.x, scale.y);
        context.scale(scale.x, -scale.y);
        

        context.fillStyle = color;
        const textHeight = 1.0;
        context.font = "bold "+textHeight+"px Arial";
        context.fillStyle = "azure";
        context.shadowBlur = 10;
        const textOffset = context.measureText(text).width/2;
        context.strokeText(text, -textOffset, textHeight/4);
        context.fillText(text, -textOffset, textHeight/4);

        context.shadowBlur = 0;


        context.resetTransform();
    }
}