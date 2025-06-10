import { rgb } from "../../Helpers/Color";
import { CameraPlugin } from "../../Plugins/Camera";
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
        const world = this.getGameWorld();
        const transform = this.getTransform();
        const camera = this.getPlugin(CameraPlugin);
        if (!world || !transform || !camera) return;


        const x = transform.position.x;
        const y = transform.position.y;
        const r = transform.rotation;
        const scale = transform.scale;
        
        const color = this.color.toString();
        const color2 = this.getComponent(PolygonRendererC)?.color.toString()??rgb.stroke.toString();


        context.setTransform(camera.getCameraTransform());
        context.translate(x, y);
        context.rotate(r);
        context.scale(scale.x, scale.y);
     
        context.beginPath();
        context.fillStyle = color2;
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
        

        context.resetTransform();
    }
}