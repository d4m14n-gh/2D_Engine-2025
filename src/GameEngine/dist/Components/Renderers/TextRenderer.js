import { rgb } from "../../Helpers/Color";
import { CameraPlugin } from "../../Plugins/Camera";
import { RendererC } from "./Renderer";
export class TextRendererC extends RendererC {
    color = new rgb(42, 42, 55);
    text;
    displayName;
    constructor(text, displayName = false, zindex = 1) {
        super();
        this.text = text;
        this.zindex = zindex;
        this.displayName = displayName;
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
        const color = this.color.toString();
        const cx = (x - cmx);
        const cy = (y - cmy);
        context.save();
        context.fillStyle = color;
        context.translate(offset.x, offset.y);
        context.scale(scale.x, scale.y);
        context.translate(cx, cy);
        // context.rotate(r);
        context.scale(transformScale.x, transformScale.y);
        context.scale(1, -1);
        // context.shadowBlur = 0;
        // context.fillRect(-a, -a, 2*a, 2*a);
        // context.shadowBlur = 30;
        // context.strokeRect(-a, -a, 2*a, 2*a);
        const text = this.displayName ? this.getGameObject().name : this.text;
        const textHeight = 1.0;
        context.font = "bold " + textHeight + "px Arial";
        context.fillStyle = "azure";
        const textOffset = context.measureText(text).width / 2;
        context.strokeText(text, -textOffset, textHeight / 4);
        context.fillText(text, -textOffset, textHeight / 4);
        context.restore();
    }
}
