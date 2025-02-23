import { Color } from "../../Helpers/Color";
import { CameraPlugin } from "../../Plugins/Camera";
import { ConfigPlugin } from "../../Plugins/Config";
import { RendererC } from "../Renderer";

export class CircleRendererC extends RendererC {
    public radius: number = 3;

    constructor(radius: number, zindex=0, color=Color.randomColor2()){
        super();
        this.color = color;
        this.radius = radius;
        this.zindex = zindex;
    }

    public render(context: CanvasRenderingContext2D): void {
     
        const size = [context.canvas.width, context.canvas.height];
        const x = this.gameObject.transform.position.x;
        const y = this.gameObject.transform.position.y;
        const r = this.gameObject.transform.rotation;
        const transformScale = this.gameObject.transform.scale;
        const scale = this.gameObject.gameWorld.getPlugin<CameraPlugin>(CameraPlugin.name).scale;

        const a = this.radius;
        const cmx = this.gameObject.gameWorld.getPlugin<CameraPlugin>(CameraPlugin.name).cameraPositon.x;
        const cmy = this.gameObject.gameWorld.getPlugin<CameraPlugin>(CameraPlugin.name).cameraPositon.y;
        const color = this.color.toString();

        const cx: number = (x-cmx);
        const cy: number = -(y-cmy);

        context.save();
        
        context.translate(size[0]/2, size[1]/2);
        context.scale(scale, scale);
        context.translate(cx, cy);
        context.rotate(r);
        context.scale(transformScale.x, transformScale.y);
        
        context.fillStyle = color;
        context.shadowBlur = 30;
        context.beginPath();
        context.arc(0, 0, a, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
        context.stroke();

        context.restore();
    }
}