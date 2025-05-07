"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BarRendererC = void 0;
const Color_1 = require("../../Helpers/Color");
const Vector_1 = require("../../Helpers/Vector");
const Camera_1 = require("../../Plugins/Camera");
const Renderer_1 = require("./Renderer");
const Health_1 = require("../Health");
class BarRendererC extends Renderer_1.RendererC {
    offset = new Vector_1.Vector(0, 4);
    fill = 0.5;
    width = 5;
    height = 0.5;
    constructor(zindex = 0) {
        super(zindex);
    }
    render(context) {
        let width = this.width;
        let fill = this.fill;
        try {
            fill = this.getComponent(Health_1.HealthC).getHealth();
            width = 2 + this.getComponent(Health_1.HealthC).maxHealth / 250.0;
        }
        catch { }
        if (fill >= 1 || fill <= 0)
            return;
        const size = [context.canvas.width, context.canvas.height];
        const x = this.getTransform().position.x;
        const y = this.getTransform().position.y;
        const transformScale = this.getTransform().scale;
        const scale = this.getGameWorld().getPlugin(Camera_1.CameraPlugin).scale;
        const cmx = this.getGameWorld().getPlugin(Camera_1.CameraPlugin).cameraPositon.x;
        const cmy = this.getGameWorld().getPlugin(Camera_1.CameraPlugin).cameraPositon.y;
        const color = Color_1.rgb.getHeatmapColor(fill).toString();
        const cx = (x - cmx);
        const cy = -(y - cmy);
        const radius = 0.25;
        context.save();
        context.translate(size[0] / 2, size[1] / 2);
        context.scale(scale, scale);
        context.translate(cx, cy);
        // context.rotate(r);
        context.scale(transformScale.x, transformScale.y);
        context.translate(this.offset.x, -this.offset.y);
        context.fillStyle = color;
        context.shadowBlur = 0;
        context.beginPath();
        context.roundRect(-width / 2, -this.height / 2, width, this.height, radius);
        context.closePath();
        context.fillStyle = Color_1.rgb.background.toString();
        context.fill();
        context.beginPath();
        context.roundRect(-width / 2, -this.height / 2, width * fill, this.height, radius);
        context.closePath();
        context.fillStyle = color;
        context.fill();
        context.beginPath();
        context.roundRect(-width / 2, -this.height / 2, width, this.height, radius);
        context.closePath();
        context.shadowBlur = 30;
        context.stroke();
        context.beginPath();
        context.roundRect(-width / 2, -this.height / 2, width * fill, this.height, radius);
        context.closePath();
        context.shadowBlur = 0;
        context.stroke();
        context.restore();
    }
}
exports.BarRendererC = BarRendererC;
