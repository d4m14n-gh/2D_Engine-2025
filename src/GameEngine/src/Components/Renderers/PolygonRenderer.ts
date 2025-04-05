import { rgb } from "../../Helpers/Color";
import { CameraPlugin } from "../../Plugins/Camera";
import { RendererC } from "./Renderer";

export class PolygonRendererC extends RendererC {
    public color: rgb;
    public radius: number;
    public n: number;

    constructor(side: number, n: number=4, zindex=0, color=rgb.randomColor2()){
        super();
        this.radius = side;
        this.n = n;
        this.zindex = zindex;
        this.color = color;
    }

    public render(context: CanvasRenderingContext2D): void {
     
        const offset = this.getGameWorld().getPlugin(CameraPlugin).cameraOffset;
        const x = this.getTransform().position.x;
        const y = this.getTransform().position.y;
        const r = this.getTransform().rotation;
        const transformScale = this.getTransform().scale;
        const scale = this.getGameWorld().getPlugin(CameraPlugin).scale;

        const cmx = this.getGameWorld().getPlugin(CameraPlugin).cameraPositon.x;
        const cmy = this.getGameWorld().getPlugin(CameraPlugin).cameraPositon.y;
        const color = this.color.toString();

        const cx: number = (x-cmx);
        const cy: number = (y-cmy);


        context.save();
        
        context.translate(offset.x, offset.y);
        context.scale(scale.x, scale.y);
        context.translate(cx, cy);
        context.rotate(r);
        context.scale(transformScale.x, transformScale.y);
        
        const a = this.radius;
        if(this.n<10){
            context.beginPath();
            context.moveTo(0, a);
            const angle: number = (2*Math.PI)/this.n;
            for(let i=1;i<this.n;i++){
                context.lineTo(Math.sin(i*angle)*a, Math.cos(i*angle)*a);
            }
            context.closePath();
        }
        else{
            context.beginPath();
            context.arc(0, 0, a, 0, 2 * Math.PI);
            context.closePath();
        }
        
        context.fillStyle = color;
        context.shadowBlur = 0;
        context.fill();
        context.shadowBlur = 50;
        context.stroke();

        context.restore();
    }
}