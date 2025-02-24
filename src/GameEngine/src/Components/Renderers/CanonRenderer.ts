import { Color } from "../../Helpers/Color";
import { CameraPlugin } from "../../Plugins/Camera";
import { CanonC } from "../Canon";
import { RendererC } from "./Renderer";

export class CanonRendererC extends RendererC {
    private color: Color;
    private length: number;
    private width: number;

    constructor(length: number=4, width: number=2, zindex=0, color=Color.background.clone()){
        super();
        this.zindex = zindex;
        this.color = color;
        this.color = new Color(91, 93, 98);
        this.length = length;
        this.width = width;
    }

    public render(context: CanvasRenderingContext2D): void {
     
        const size = [context.canvas.width, context.canvas.height];
        const x = this.gameObject.transform.position.x;
        const y = this.gameObject.transform.position.y;
        const transformScale = this.gameObject.transform.scale;
        const scale = this.gameObject.gameWorld.getPlugin<CameraPlugin>(CameraPlugin.name).scale;

        const cmx = this.gameObject.gameWorld.getPlugin<CameraPlugin>(CameraPlugin.name).cameraPositon.x;
        const cmy = this.gameObject.gameWorld.getPlugin<CameraPlugin>(CameraPlugin.name).cameraPositon.y;
        const color = this.color.toString();

        const cx: number = (x-cmx);
        const cy: number = -(y-cmy);
        const canon = this.gameObject.getComponent<CanonC>(CanonC.name);
        const sp: number = Math.sin( Math.min(1, canon.getShotDelta()/canon.cooldown) * Math.PI);


        context.save();
        
        context.translate(size[0]/2, size[1]/2);
        context.scale(scale, scale);
        context.translate(cx, cy);
        context.scale(transformScale.x, transformScale.y);
        
        context.rotate(-canon.direction.toRad());
        
        context.beginPath();
        context.roundRect(0, -this.width/2, this.length-sp, this.width, 0.25);
        context.closePath();
        
        context.fillStyle = color;
        context.shadowBlur = 0;
        context.fill();
        context.shadowBlur = 30;
        context.stroke();

        context.restore();
    }
}