"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TracesRendererC = void 0;
const Color_1 = require("../../Helpers/Color");
const Vector_1 = require("../../Helpers/Vector");
const Camera_1 = require("../../Plugins/Camera");
const Renderer_1 = require("./Renderer");
class TracesRendererC extends Renderer_1.RendererC {
    color;
    traces = [];
    lastPosition = Vector_1.Vector.zero();
    transparency = 2;
    duration = 1;
    length = 2;
    constructor(zindex = 0, color = new Color_1.rgb(66, 83, 68)) {
        super();
        this.zindex = zindex;
        this.color = color;
    }
    render(context) {
        const size = [context.canvas.width, context.canvas.height];
        // const transformScale = this.getTransform().scale;
        const scale = this.getGameWorld().getPlugin(Camera_1.CameraPlugin).scale;
        const cmx = this.getGameWorld().getPlugin(Camera_1.CameraPlugin).cameraPositon.x;
        const cmy = this.getGameWorld().getPlugin(Camera_1.CameraPlugin).cameraPositon.y;
        ////////////////////
        const currentPosition = this.getTransform().position.clone();
        const currentRotation = this.getTransform().rotation;
        if (this.lastPosition.distance(currentPosition) > 0.75) {
            this.traces.push({
                position: currentPosition,
                rotation: currentRotation,
                startTime: this.getGameWorld().getTotal(),
            });
            this.lastPosition = this.getTransform().position.clone(); //.position.add(new Vector(1, 2)); 
        }
        ////////////////////
        while (this.traces.length > 0 && this.traces[0].startTime + this.duration < this.getGameWorld().getTotal())
            this.traces.shift();
        for (const trace of this.traces) {
            const cx = trace.position.x - cmx;
            const cy = trace.position.y - cmy;
            const lifeTime = 1 - (this.getGameWorld().getTotal() - trace.startTime) / this.duration;
            context.save();
            context.translate(size[0] / 2, size[1] / 2);
            context.scale(scale, -scale);
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
exports.TracesRendererC = TracesRendererC;
