import { rgb } from "../../Helpers/Color";
import { CameraPlugin } from "../../Plugins/Camera";
import { PolygonRendererC } from "./PolygonRenderer";
import { RendererC } from "./Renderer";

export class BulletRendererC extends RendererC {
    public color: rgb;
    public radius: number;

    constructor(side: number, zindex=0, color=rgb.randomColor2()){
        super();
        this.radius = side;
        this.zindex = zindex;
        this.color = color;
    }

    public render(context: CanvasRenderingContext2D): void {
     
        const offset = this.getGameWorld().getPlugin(CameraPlugin).cameraScreenOffset;
        const x = this.getTransform().position.x;
        const y = this.getTransform().position.y;
        const r = this.getTransform().rotation;
        const transformScale = this.getTransform().scale;
        const scale = this.getGameWorld().getPlugin(CameraPlugin).scaleV;

        const cmx = this.getGameWorld().getPlugin(CameraPlugin).cameraPositon.x;
        const cmy = this.getGameWorld().getPlugin(CameraPlugin).cameraPositon.y;
        const color = this.color.toString();

        const cx: number = (x-cmx);
        const cy: number = (y-cmy);

        context.translate(offset.x, offset.y);
        context.scale(scale.x, scale.y);
        context.translate(cx, cy);
        context.rotate(r);
        context.scale(transformScale.x, transformScale.y);
        
        const a = this.radius;



        const w = 4;
        context.beginPath();
        context.rect(-3*a-w, -a, w, 2*a);
        context.closePath();
        // Create a gradient in the local object space, not world space
        const grad = context.createLinearGradient(-3*a-w, 0, w, 0);
        grad.addColorStop(0, rgb.stroke.toArgb(0).toString());
        grad.addColorStop(1, color);// rgb.stroke.toString());

        context.fillStyle = grad;
        context.shadowBlur = 0;
        context.fill();


      
        context.beginPath();
        context.arc(0, 0, a, 0, 2 * Math.PI);
        context.closePath();
        
        context.fillStyle = color;
        context.shadowBlur = 0; 
        context.fill();
        context.shadowBlur = 50;
        context.stroke();


        context.beginPath();
        context.roundRect(-3*a, -a, 3*a, 2*a, a/2);
        context.closePath();

        context.fillStyle = this.color.blend(rgb.background, 1).toString();
        context.shadowBlur = 0; 
        context.fill();
        context.shadowBlur = 50;
        context.stroke();

        context.setTransform(1, 0, 0, 1, 0, 0);
    }
}