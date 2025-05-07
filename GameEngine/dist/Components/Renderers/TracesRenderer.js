import { rgb as rgb } from "../../Helpers/Color";
import { Vector } from "../../Helpers/Vector";
import { CameraPlugin } from "../../Plugins/Camera";
import { RendererC } from "./Renderer";
export class TracesRendererC extends RendererC {
    color;
    traces = [];
    lastPosition = Vector.zero();
    transparency = 2;
    duration = 1;
    length = 2;
    constructor(zindex = 0, color = new rgb(66, 83, 68)) {
        super();
        this.zindex = zindex;
        this.color = color;
    }
    render(context) {
        const offset = this.getGameWorld().getPlugin(CameraPlugin).cameraOffset;
        // const transformScale = this.getTransform().scale;
        const scale = this.getGameWorld().getPlugin(CameraPlugin).scale;
        const cmx = this.getGameWorld().getPlugin(CameraPlugin).cameraPositon.x;
        const cmy = this.getGameWorld().getPlugin(CameraPlugin).cameraPositon.y;
        ////////////////////
        const currentPosition = this.getTransform().position.clone();
        const currentRotation = this.getTransform().rotation;
        if (this.lastPosition.distance(currentPosition) > 0.75) {
            this.traces.push({
                position: currentPosition,
                rotation: currentRotation,
                startTime: this.getGameWorld().getWorldTime(),
            });
            this.lastPosition = this.getTransform().position.clone(); //.position.add(new Vector(1, 2)); 
        }
        ////////////////////
        while (this.traces.length > 0 && this.traces[0].startTime + this.duration < this.getGameWorld().getWorldTime())
            this.traces.shift();
        for (const trace of this.traces) {
            const cx = trace.position.x - cmx;
            const cy = trace.position.y - cmy;
            const lifeTime = 1 - (this.getGameWorld().getWorldTime() - trace.startTime) / this.duration;
            context.save();
            context.translate(offset.x, offset.y);
            context.scale(scale.x, scale.y);
            context.translate(cx, cy);
            context.rotate(trace.rotation);
            // context.scale(transformScale.x, transformScale.y);
            context.beginPath();
            context.fillStyle = this.color.toArgb(this.transparency * lifeTime).toString();
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
