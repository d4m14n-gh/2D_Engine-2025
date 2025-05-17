import { rgb } from "../../Helpers/Color";
import { Vector } from "../../Helpers/Vector";
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
        const camera = this.getPlugin(CameraPlugin)!;
        const body = this.gameObject!.getBody()!;
        const offset = camera.cameraScreenOffset;
        const x = body.getPosition().x;
        const y = body.getPosition().y;
        const r = body.getRotation();
        const transformScale = Vector.one();//this.getTransform().scale;
        const scale = camera.scaleV;

        const cmx = camera.cameraPosition.x;
        const cmy = camera.cameraPosition.y;
        const color = this.color.toString();

        const cx: number = (x-cmx);
        const cy: number = (y-cmy);


        // context.save();
        // const sin = Math.sin(r);
        // const cos = Math.cos(r);

        // const sx = scale.x * transformScale.x;
        // const sy = scale.y * transformScale.y;
        // const a2 = cos * sx;
        // const b = sin * sx;
        // const c = -sin * sy;
        // const d = cos * sy;
        // const e = offset.x + scale.x * (cx * cos - cy * sin);
        // const f = offset.y + scale.y * (cx * sin + cy * cos);

        // // Ustaw bezpośrednio macierz transformacji
        // context.setTransform(a2, b, c, d, e, f);

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

        context.shadowBlur = 0;
        context.setTransform(1, 0, 0, 1, 0, 0);

        // context.restore();
    }
}