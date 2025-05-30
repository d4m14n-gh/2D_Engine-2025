import { Vector } from "../../Helpers/Vector";
import { CameraPlugin } from "../../Plugins/Camera";
import { RendererC } from "./Renderer";
export class ImageRendererC extends RendererC {
    image = new Image();
    side;
    offset;
    constructor(side = Vector.zero(), offset = Vector.zero(), src = "GameEngine/src/Assets/vectorpaint3.svg", zindex = 0) {
        super();
        this.zindex = zindex;
        this.side = side;
        this.offset = offset;
        this.image.src = src;
    }
    render(context) {
        const offset = this.getGameWorld().getPlugin(CameraPlugin).cameraOffset;
        const x = this.getTransform().position.x;
        const y = this.getTransform().position.y;
        const r = this.getTransform().rotation;
        const transformScale = this.getTransform().scale;
        const scale = this.getGameWorld().getPlugin(CameraPlugin).scale;
        const cmx = this.getGameWorld().getPlugin(CameraPlugin).cameraPositon.x;
        const cmy = this.getGameWorld().getPlugin(CameraPlugin).cameraPositon.y;
        const cx = (x - cmx);
        const cy = (y - cmy);
        let a = this.side;
        if (a.x == 0)
            a.x = this.image.width;
        if (a.y == 0)
            a.y = this.image.height;
        context.save();
        context.translate(offset.x, offset.y);
        context.scale(scale.x, scale.y);
        context.translate(cx, cy);
        context.rotate(r);
        context.scale(transformScale.x, transformScale.y);
        context.translate(this.offset.x, this.offset.y);
        context.shadowBlur = 15;
        context.drawImage(this.image, -a.x / 2, -a.y / 2, a.x, a.y);
        context.restore();
    }
}
