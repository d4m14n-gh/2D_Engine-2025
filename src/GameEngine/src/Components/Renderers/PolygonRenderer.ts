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
        const world = this.getGameWorld();
        const transform = this.getTransform();
        const camera = this.getPlugin(CameraPlugin);
        if (!world || !transform || !camera) return;


        const x = transform.position.x;
        const y = transform.position.y;
        const r = transform.rotation;
        const scale = transform.scale;
        
        const color = this.color.toString();
        const size = this.radius;

        context.setTransform(camera.getCameraTransform());
        context.translate(x, y);
        context.rotate(r);
        context.scale(scale.x, scale.y);
        
        
        if(this.n<10){
            context.beginPath();
            context.moveTo(0, size);
            const angle: number = (2*Math.PI)/this.n;
            for(let i=1;i<this.n;i++)
                context.lineTo(Math.sin(i*angle)*size, Math.cos(i*angle)*size);
            context.closePath();
        }
        else{
            context.beginPath();
            context.arc(0, 0, size, 0, 2 * Math.PI);
            context.closePath();
        }
        
        context.fillStyle = color;
        context.shadowBlur = 0; 
        context.fill();
        context.shadowBlur = 50;
        context.stroke();
        context.shadowBlur = 0;


        context.resetTransform();
    }
}