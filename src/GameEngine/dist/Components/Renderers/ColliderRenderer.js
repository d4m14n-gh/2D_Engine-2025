import { rgb } from "../../Helpers/Color";
import { CameraPlugin } from "../../Plugins/Camera";
import { ConfigPlugin } from "../../Plugins/Config";
import { ColliderC } from "../Collider";
import { RendererC } from "./Renderer";
export class ColliderRendererC extends RendererC {
    activeColor = new rgb(172, 42, 55, 0.125);
    staticColor = new rgb(95, 64, 36, 0.125);
    dynamicColor = new rgb(57, 127, 31, 0.125);
    disabledColor = new rgb(36, 24, 36, 0.125);
    constructor() {
        super();
        this.zindex = -1;
        this.enable(ConfigPlugin.get("displayColliders") ?? false);
    }
    getColor() {
        let color = this.dynamicColor;
        let collider = this.getComponent(ColliderC);
        if (!collider.isEnabled)
            color = this.disabledColor;
        else if (collider.isActive)
            color = this.activeColor;
        else if (collider.isStatic)
            color = this.staticColor;
        return color;
    }
    render(context) {
        const collider = this.getComponent(ColliderC);
        const offset = collider.offset;
        const radius = collider.radius + 0.25;
        const color = this.getColor();
        const size = [context.canvas.width, context.canvas.height];
        const x = this.getTransform().position.x + offset.x;
        const y = this.getTransform().position.y + offset.y;
        const r = this.getTransform().rotation;
        const scale = this.getGameWorld().getPlugin(CameraPlugin).scale;
        const a = radius;
        const cmx = this.getGameWorld().getPlugin(CameraPlugin).cameraPositon.x;
        const cmy = this.getGameWorld().getPlugin(CameraPlugin).cameraPositon.y;
        const cx = (x - cmx);
        const cy = -(y - cmy);
        context.save();
        context.translate(size[0] / 2, size[1] / 2);
        context.scale(scale, scale);
        context.translate(cx, cy);
        context.rotate(r);
        context.strokeStyle = color.toRgb().toString();
        context.fillStyle = color.toString();
        context.shadowBlur = 30;
        context.beginPath();
        context.arc(0, 0, a, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
        context.stroke();
        context.restore();
    }
}
