import { rgb } from "../../Helpers/Color";
import { CameraPlugin } from "../../Plugins/Camera";
import { RendererC } from "./Renderer";
export class PolygonRendererC extends RendererC {
    color;
    radius;
    n;
    constructor(side, n = 4, zindex = 0, color = rgb.randomColor2()) {
        super();
        this.radius = side;
        this.n = n;
        this.zindex = zindex;
        this.color = color;
    }
    render(context) {
        const size = [context.canvas.width, context.canvas.height];
        const x = this.getTransform().position.x;
        const y = this.getTransform().position.y;
        const r = this.getTransform().rotation;
        const transformScale = this.getTransform().scale;
        const scale = this.getGameWorld().getPlugin(CameraPlugin).scale;
        const cmx = this.getGameWorld().getPlugin(CameraPlugin).cameraPositon.x;
        const cmy = this.getGameWorld().getPlugin(CameraPlugin).cameraPositon.y;
        const color = this.color.toString();
        const cx = (x - cmx);
        const cy = -(y - cmy);
        context.save();
        context.translate(size[0] / 2, size[1] / 2);
        context.scale(scale, scale);
        context.translate(cx, cy);
        context.rotate(r);
        context.scale(transformScale.x, transformScale.y);
        const a = this.radius;
        if (this.n < 10) {
            context.beginPath();
            context.moveTo(0, a);
            const angle = (2 * Math.PI) / this.n;
            for (let i = 1; i < this.n; i++) {
                context.lineTo(Math.sin(i * angle) * a, Math.cos(i * angle) * a);
            }
            context.closePath();
        }
        else {
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
