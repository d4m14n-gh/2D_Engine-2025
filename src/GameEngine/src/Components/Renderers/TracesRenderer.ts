import { rgb as rgb } from "../../Helpers/Color";
import { Vector } from "../../Helpers/Vector";
import { CameraPlugin } from "../../Plugins/Camera";
import { RendererC } from "./Renderer";

type Trace = {
    position: Vector;
    rotation: number;
    startTime: number;
}

export class TracesRendererC extends RendererC {
    public color: rgb;
    private traces: Trace[] = [];
    private lastPosition: Vector = Vector.zero();
    private transparency: number = 2;
    private duration: number = 1;
    private length: number = 2;

    constructor(zindex=0, color=new rgb(66, 83, 68)){
        super();
        this.zindex = zindex;
        this.color = color;
    }

    public render(context: CanvasRenderingContext2D): void {
     
        const size = [context.canvas.width, context.canvas.height];
        // const transformScale = this.getTransform().scale;
        const scale = this.getGameWorld().getPlugin(CameraPlugin).scale;

        const cmx = this.getGameWorld().getPlugin(CameraPlugin).cameraPositon.x;
        const cmy = this.getGameWorld().getPlugin(CameraPlugin).cameraPositon.y;

        ////////////////////

        const currentPosition = this.getTransform().position.clone();
        const currentRotation = this.getTransform().rotation;
        if(this.lastPosition.distance(currentPosition)>0.75){
            this.traces.push(
                {
                    position: currentPosition,
                    rotation: currentRotation,
                    startTime: this.getGameWorld().getTotal(),
                }
            );
            this.lastPosition = this.getTransform().position.clone();//.position.add(new Vector(1, 2)); 
        }

        ////////////////////
        while(this.traces.length>0&&this.traces[0].startTime+this.duration<this.getGameWorld().getTotal())
            this.traces.shift();
        for (const trace of this.traces) {
            const cx: number = trace.position.x-cmx;
            const cy: number = trace.position.y-cmy;
            
            const lifeTime: number = 1-(this.getGameWorld().getTotal()-trace.startTime)/this.duration;

            context.save();
            context.translate(size[0]/2, size[1]/2);
            context.scale(scale, -scale);

            context.translate(cx, cy);
            context.rotate(trace.rotation);
            // context.scale(transformScale.x, transformScale.y);

            context.beginPath();
            context.fillStyle = this.color.toArgb(this.transparency*lifeTime).toString();
            context.shadowBlur = 0;
            context.roundRect(-4.5, -3.25, this.length, 2, 0.75);
            context.fill();
            context.closePath();
            
            context.beginPath();
            context.roundRect(-4.5, 1.25, this.length, 2, 0.75);
            context.fill();
            context.closePath();
            context.restore();
        }
    }
}