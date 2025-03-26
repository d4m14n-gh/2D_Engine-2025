import { rgb } from "../../Helpers/Color";
import { CameraPlugin } from "../../Plugins/Camera";
import { CanonC } from "../Canon";
import { PolygonRendererC } from "./PolygonRenderer";
import { RendererC } from "./Renderer";
export class CanonRendererC extends RendererC {
    color;
    constructor(zindex = 0, color = rgb.background.clone()) {
        super();
        this.zindex = zindex;
        this.color = color;
    }
    render(context) {
        const length = this.getComponent(CanonC).length;
        const width = this.getComponent(CanonC).width;
        const size = [context.canvas.width, context.canvas.height];
        const x = this.getTransform().position.x;
        const y = this.getTransform().position.y;
        const transformScale = this.getTransform().scale;
        const scale = this.getGameWorld().getPlugin(CameraPlugin).scale;
        const cmx = this.getGameWorld().getPlugin(CameraPlugin).cameraPositon.x;
        const cmy = this.getGameWorld().getPlugin(CameraPlugin).cameraPositon.y;
        const color = this.color.toString();
        const color2 = this.getComponent(PolygonRendererC).color.toString();
        const cx = (x - cmx);
        const cy = (y - cmy);
        const canon = this.getComponent(CanonC);
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
