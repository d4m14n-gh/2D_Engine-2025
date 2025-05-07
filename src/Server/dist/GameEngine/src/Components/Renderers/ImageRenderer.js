"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageRendererC = void 0;
const Vector_1 = require("../../Helpers/Vector");
const Camera_1 = require("../../Plugins/Camera");
const Renderer_1 = require("./Renderer");
class ImageRendererC extends Renderer_1.RendererC {
    image = new Image();
    side;
    offset;
    constructor(side = Vector_1.Vector.zero(), offset = Vector_1.Vector.zero(), src = "GameEngine/src/Assets/vectorpaint3.svg", zindex = 0) {
        super();
        this.zindex = zindex;
        this.side = side;
        this.offset = offset;
        this.image.src = src;
    }
    onSpawn() {
        // this.getComponent(PolygonRendererC).enable(false);
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
        const cx = (x - cmx);
        const cy = -(y - cmy);
        let a = this.side;
        if (a.x == 0)
            a.x = this.image.width;
        if (a.y == 0)
            a.y = this.image.height;
        context.save();
        context.translate(size[0] / 2, size[1] / 2);
        context.scale(scale, scale);
        context.translate(cx, cy);
        context.rotate(r);
        context.scale(transformScale.x, transformScale.y);
        context.translate(this.offset.x, this.offset.y);
        context.shadowBlur = 15;
        context.drawImage(this.image, -a.x / 2, -a.y / 2, a.x, a.y);
        context.restore();
    }
}
exports.ImageRendererC = ImageRendererC;
