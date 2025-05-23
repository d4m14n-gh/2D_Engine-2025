"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChasisRendererC = void 0;
const Color_1 = require("../../Helpers/Color");
const Camera_1 = require("../../Plugins/Camera");
const PolygonRenderer_1 = require("./PolygonRenderer");
const Renderer_1 = require("./Renderer");
class ChasisRendererC extends Renderer_1.RendererC {
    color;
    constructor(zindex = 0, color = new Color_1.rgb(22, 24, 25)) {
        super();
        this.zindex = zindex;
        this.color = color;
    }
    render(context) {
        const size = [context.canvas.width, context.canvas.height];
        const x = this.getTransform().position.x;
        const y = this.getTransform().position.y;
        const r = this.getTransform().rotation;
        const transformScale = this.getTransform().scale;
        const scale = this.getGameWorld().getPlugin(Camera_1.CameraPlugin).scale;
        const cmx = this.getGameWorld().getPlugin(Camera_1.CameraPlugin).cameraPositon.x;
        const cmy = this.getGameWorld().getPlugin(Camera_1.CameraPlugin).cameraPositon.y;
        const color = this.color.toString();
        const cx = x - cmx;
        const cy = y - cmy;
        context.save();
        context.translate(size[0] / 2, size[1] / 2);
        context.scale(scale, -scale);
        context.translate(cx, cy);
        context.rotate(r);
        context.scale(transformScale.x, transformScale.y);
        context.beginPath();
        context.fillStyle = this.getComponent(PolygonRenderer_1.PolygonRendererC).color.toString();
        context.shadowBlur = 0;
        context.roundRect(-4, -2, 8, 4, 1);
        context.fill();
        context.shadowBlur = 50;
        context.stroke();
        context.closePath();
        context.beginPath();
        context.fillStyle = Color_1.rgb.background.toString();
        context.shadowBlur = 0;
        context.roundRect(-4.5, -3.25, 10, 2, 0.5);
        context.fill();
        context.shadowBlur = 50;
        context.stroke();
        context.closePath();
        context.beginPath();
        context.shadowBlur = 0;
        context.roundRect(-4.5, 1.25, 10, 2, 0.5);
        context.fill();
        context.shadowBlur = 50;
        context.stroke();
        context.closePath();
        context.beginPath();
        context.fillStyle = Color_1.rgb.background.toString();
        context.shadowBlur = 0;
        context.roundRect(-3, -2, 6, 4, 1.5);
        context.fill();
        context.shadowBlur = 50;
        context.stroke();
        context.closePath();
        context.restore();
    }
}
exports.ChasisRendererC = ChasisRendererC;
