// import { rgb as rgb } from "../../Helpers/Color";
// import { Vector } from "../../Helpers/Vector";
// import { CameraPlugin } from "../../Plugins/Camera";
// import { RendererC } from "./Renderer";

// type Trace = {
//     position: Vector;
//     rotation: number;
//     startTime: number;
// }

// export class TracesRendererC extends RendererC {
//     public color: rgb;
//     public tracesSpace: number = 0.5;

//     private traces: Trace[] = [];
//     private lastPosition?: Vector = undefined;
//     private transparency: number = 2;
//     private duration: number = 1;
//     private length: number = 2;

//     constructor(zindex=0, color=new rgb(66, 83, 68)){
//         super();
//         color=color.blend(rgb.stroke, 0.3);//.toArgb(0.75);
//         this.zindex = zindex;
//         this.color = color;
//     }

//     public render(context: CanvasRenderingContext2D): void {
     
//         const offset = this.getGameWorld().getPlugin(CameraPlugin).cameraScreenOffset;
//         const scale = this.getGameWorld().getPlugin(CameraPlugin).scaleV;

//         const cmx = this.getGameWorld().getPlugin(CameraPlugin).cameraPositon.x;
//         const cmy = this.getGameWorld().getPlugin(CameraPlugin).cameraPositon.y;

//         ////////////////////

//         const currentPosition = this.getTransform().position.clone();
//         const currentRotation = this.getTransform().rotation;

//         if (this.lastPosition == undefined)
//             this.lastPosition = currentPosition.clone();
//         let mv = currentPosition.sub(this.lastPosition);
//         while(mv.magnitude()>this.tracesSpace){
//             this.traces.push(
//                 {
//                     position: this.lastPosition,
//                     rotation: currentRotation,
//                     startTime: this.getGameWorld().getWorldTime(),
//                 }
//             );
//             this.lastPosition = this.lastPosition.add(mv.toUnit().times(this.tracesSpace));
//             mv = currentPosition.sub(this.lastPosition);
//         }

//         ////////////////////
//         while(this.traces.length>0&&this.traces[0].startTime+this.duration<this.getGameWorld().getWorldTime())
//             this.traces.shift();

//         for (const trace of this.traces) {
//             const cx: number = trace.position.x-cmx;
//             const cy: number = trace.position.y-cmy;
            
//             const lifeTime: number = 1-(this.getGameWorld().getWorldTime()-trace.startTime)/this.duration;

//             context.translate(offset.x, offset.y);
//             context.scale(scale.x, scale.y);

//             context.translate(cx, cy);
//             context.rotate(trace.rotation);

//             context.beginPath();
//             context.fillStyle = this.color.toArgb(this.color.a*this.transparency*lifeTime).toString();
//             context.shadowBlur = 0;
//             context.roundRect(-4.5, -3.25, this.length, 2, 0.75);
//             context.fill();
//             context.closePath();
            
//             context.beginPath();
//             context.roundRect(-4.5, 1.25, this.length, 2, 0.75);
//             context.fill();
//             context.closePath();
//             context.setTransform(1, 0, 0, 1, 0, 0);
//         }
//     }
// }