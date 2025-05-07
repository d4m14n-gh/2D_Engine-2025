"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColliderRendererC = void 0;
const Color_1 = require("../../Helpers/Color");
const Camera_1 = require("../../Plugins/Camera");
const Config_1 = require("../../Plugins/Config");
const Collider_1 = require("../Collider");
const Renderer_1 = require("./Renderer");
class ColliderRendererC extends Renderer_1.RendererC {
    activeColor = new Color_1.rgb(172, 42, 55, 0.125);
    staticColor = new Color_1.rgb(95, 64, 36, 0.125);
    dynamicColor = new Color_1.rgb(57, 127, 31, 0.125);
    disabledColor = new Color_1.rgb(36, 24, 36, 0.125);
    constructor() {
        super();
        this.zindex = -1;
        this.enable(Config_1.ConfigPlugin.get("displayColliders") ?? false);
    }
    getColor() {
        let color = this.dynamicColor;
        let collider = this.getComponent(Collider_1.ColliderC);
        if (!collider.isEnabled)
            color = this.disabledColor;
        else if (collider.isActive)
            color = this.activeColor;
        else if (collider.isStatic)
            color = this.staticColor;
        return color;
    }
    render(context) {
        const collider = this.getComponent(Collider_1.ColliderC);
        const offset = collider.offset;
        const radius = collider.radius + 0.25;
        const color = this.getColor();
        const size = [context.canvas.width, context.canvas.height];
        const x = this.getTransform().position.x + offset.x;
        const y = this.getTransform().position.y + offset.y;
        const r = this.getTransform().rotation;
        const scale = this.getGameWorld().getPlugin(Camera_1.CameraPlugin).scale;
        const a = radius;
        const cmx = this.getGameWorld().getPlugin(Camera_1.CameraPlugin).cameraPositon.x;
        const cmy = this.getGameWorld().getPlugin(Camera_1.CameraPlugin).cameraPositon.y;
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
exports.ColliderRendererC = ColliderRendererC;
