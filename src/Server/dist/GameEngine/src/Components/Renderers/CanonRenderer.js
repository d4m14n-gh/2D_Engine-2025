"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanonRendererC = void 0;
const Color_1 = require("../../Helpers/Color");
const Camera_1 = require("../../Plugins/Camera");
const Canon_1 = require("../Canon");
const PolygonRenderer_1 = require("./PolygonRenderer");
const Renderer_1 = require("./Renderer");
class CanonRendererC extends Renderer_1.RendererC {
    color;
    constructor(zindex = 0, color = Color_1.rgb.background.clone()) {
        super();
        this.zindex = zindex;
        this.color = color;
    }
    render(context) {
        const length = this.getComponent(Canon_1.CanonC).length;
        const width = this.getComponent(Canon_1.CanonC).width;
        const size = [context.canvas.width, context.canvas.height];
        const x = this.getTransform().position.x;
        const y = this.getTransform().position.y;
        const transformScale = this.getTransform().scale;
        const scale = this.getGameWorld().getPlugin(Camera_1.CameraPlugin).scale;
        const cmx = this.getGameWorld().getPlugin(Camera_1.CameraPlugin).cameraPositon.x;
        const cmy = this.getGameWorld().getPlugin(Camera_1.CameraPlugin).cameraPositon.y;
        const color = this.color.toString();
        const color2 = this.getComponent(PolygonRenderer_1.PolygonRendererC).color.toString();
        const cx = (x - cmx);
        const cy = (y - cmy);
        const canon = this.getComponent(Canon_1.CanonC);
        const sp = Math.sin(Math.min(1, canon.getShotDelta() / canon.cooldown) * Math.PI);
        const r = 1;
        const range = canon.range / 5;
        // const offset = this.getComponent(RigidBodyC).velocity.reverse().times(canon.getBulletLifetime());
        // const offset = this.getComponent(RigidBodyC).velocity.add(canon.direction.times(canon.bulletSpeed)).reverse().times(canon.getBulletLifetime()/3);
        // const offset = this.getComponent(RigidBodyC).velocity.times(0.25).add(canon.direction.times(canon.bulletSpeed)).times(canon.getBulletLifetime());
        const offset = canon.direction.times(canon.bulletSpeed).times(canon.getBulletLifetime()).add(canon.getGlobalOffset());
        context.save();
        context.translate(size[0] / 2, size[1] / 2);
        context.scale(scale, -scale);
        context.translate(cx, cy);
        context.translate(offset.x, offset.y);
        // context.scale(transformScale.x, transformScale.y);
        // context.rotate(canon.direction.toRad());
        context.beginPath();
        context.arc(0, 0, r, 0, 2 * Math.PI);
        context.closePath();
        context.shadowBlur = 0;
        context.strokeStyle = color2.toString();
        context.stroke();
        context.strokeRect(-r / 2, -r / 2, r, r);
        context.restore();
        context.save();
        context.translate(size[0] / 2, size[1] / 2);
        context.scale(scale, -scale);
        context.translate(cx, cy);
        context.scale(transformScale.x, transformScale.y);
        context.rotate(canon.direction.toRad());
        context.beginPath();
        context.roundRect(0, -width / 2, (1 - sp / 3) * length, width, 0.1);
        context.closePath();
        context.fillStyle = color;
        context.shadowBlur = 0;
        context.fill();
        context.shadowBlur = 30;
        context.stroke();
        context.restore();
    }
}
exports.CanonRendererC = CanonRendererC;
