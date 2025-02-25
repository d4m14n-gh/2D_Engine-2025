import { Color } from "../../Helpers/Color";
import { CameraPlugin } from "../../Plugins/Camera";
import { RendererC } from "./Renderer";

export class PolygonRendererC extends RendererC {
    public color: Color;// = new Color(235, 235, 235, 1);
    public radius: number;
    public n: number;

    constructor(side: number, n: number=9, zindex=0, color=Color.randomColor2()){
        super();
        this.radius = side;
        this.n = n;
        this.zindex = zindex;
        this.color = color;
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
        
        context.translate(size[0]/2, size[1]/2);
        context.scale(scale, scale);
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