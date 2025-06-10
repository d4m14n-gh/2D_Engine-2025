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
    public tracesSpace: number = 0.5;

    private traces: Trace[] = [];
    private lastPosition?: Vector = undefined;
    private transparency: number = 2;
    private duration: number = 1;
    private length: number = 2;

    constructor(zindex=0, color=new rgb(66, 83, 68)){
        super();
        color=color.blend(rgb.stroke, 0.3);//.toArgb(0.75);
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

      
     
    

        ////////////////////

        const currentPosition = transform.position.clone();
        const currentRotation = transform.rotation;

        if (this.lastPosition == undefined)
            this.lastPosition = currentPosition.clone();
        let mv = currentPosition.sub(this.lastPosition);
        while(mv.magnitude()>this.tracesSpace){
            this.traces.push(
                {
                    position: this.lastPosition,
                    rotation: currentRotation,
                    startTime: this.getGameWorld()!.getWorldTime(),
                }
            );
            this.lastPosition = this.lastPosition.add(mv.toUnit().times(this.tracesSpace));
            mv = currentPosition.sub(this.lastPosition);
        }

        while(this.traces.length>0&&this.traces[0].startTime+this.duration<this.getGameWorld()!.getWorldTime())
            this.traces.shift();
        ////////////////////

        for (const trace of this.traces) {
            
            // context.setTransform(camera.getCameraTransform());
            // context.translate(x, y);
            // context.rotate(r);
            // context.scale(scale.x, scale.y);
            const lifeTime: number = 1-(world.getWorldTime()-trace.startTime)/this.duration;

            context.setTransform(camera.getCameraTransform());
            context.translate(trace.position.x, trace.position.y);
            context.rotate(trace.rotation);

            context.beginPath();
            context.fillStyle = this.color.toArgb(this.color.a*this.transparency*lifeTime).toString();
            context.shadowBlur = 0;
            context.roundRect(-4.5, -3.25, this.length, 2, 0.75);
            context.fill();
            context.closePath();
            
            context.beginPath();
            context.roundRect(-4.5, 1.25, this.length, 2, 0.75);
            context.fill();
            context.closePath();


            context.resetTransform();
        }
    }
}