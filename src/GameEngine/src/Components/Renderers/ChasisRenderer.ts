import { rgb } from "../../Helpers/Color";
import { Vector } from "../../Helpers/Vector";
import { CameraPlugin } from "../../Plugins/Camera";
import { PlayerPlugin } from "../../Plugins/Player";
import { PolygonRendererC } from "./PolygonRenderer";
import { RendererC } from "./Renderer";

export class ChasisRendererC extends RendererC {
    public color: rgb;

    constructor(zindex=0, color=new rgb(22, 24, 25)){
        super();
        this.zindex = zindex;
        this.color = color;
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

        const cx: number = x-cmx;
        const cy: number = y-cmy;


        // context.save();
        
        context.translate(offset.x, offset.y);
        context.scale(scale.x, scale.y);
        context.translate(cx, cy);
        context.rotate(r);
        context.scale(transformScale.x, transformScale.y);
        
        context.beginPath();
        context.fillStyle = this.getComponent(PolygonRendererC)!.color.toString();
        context.shadowBlur = 0;
        context.roundRect(-4, -2, 8, 4, 1);
        context.fill();
        context.shadowBlur = 50;
        context.stroke();
        context.closePath();
        
        context.beginPath();
        context.fillStyle = rgb.background.toString();
        context.shadowBlur = 0;
        context.roundRect(-4.5, -3.25, 10, 2, 0.5);
        context.fill();
        context.shadowBlur = 50;
        context.stroke();
        context.closePath();
        
        context.beginPath();
        context.shadowBlur = 0;
        context.roundRect(-4.5, 1.25, 10, 2, 0.5);
        context.fill();
        context.shadowBlur = 50;
        context.stroke();
        context.closePath();
        
        context.beginPath();
        context.fillStyle = rgb.background.toString();
        context.shadowBlur = 0;
        context.roundRect(-3, -2, 6, 4, 1.5);
        context.fill();
        context.shadowBlur = 50;
        context.stroke();
        context.closePath()
        context.shadowBlur = 0;;
        
        context.setTransform(1, 0, 0, 1, 0, 0);
        // context.restore();
    }
}