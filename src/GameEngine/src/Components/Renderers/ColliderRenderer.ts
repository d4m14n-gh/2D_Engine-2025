import { Color } from "../../Helpers/Color";
import { Vector } from "../../Helpers/Vector";
import { CameraPlugin } from "../../Plugins/Camera";
import { ConfigPlugin } from "../../Plugins/Config";
import { ColliderC } from "../Collider";
import { RendererC } from "./Renderer";

export class ColliderRendererC extends RendererC {
    private activeColor: Color = new Color(172, 42, 55, 0.125);
    private staticColor: Color = new Color(95, 64, 36, 0.125);
    private dynamicColor: Color = new Color(57, 127, 31, 0.125);
    private disabledColor: Color = new Color(36, 24, 36, 0.125);

    constructor(){
        super();
        this.zindex = -1;
        this.enabled = ConfigPlugin.get("displayColliders")??false;
    }

    public getColor(): Color{
        let color: Color = this.dynamicColor; 
        let collider: ColliderC = this.gameObject.getComponent<ColliderC>(ColliderC.name);
        if (!collider.enabled)
            color = this.disabledColor;
        else if (collider.isActive)
            color = this.activeColor;
        else if(collider.isStatic)
            color = this.staticColor;
        return color;
    }
    
    public render(context: CanvasRenderingContext2D): void {
        const collider: ColliderC = this.gameObject.getComponent<ColliderC>(ColliderC.name);
        const offset = collider.offset;
        const radius = collider.radius+0.25;
        const color = this.getColor();
     
        const size = [context.canvas.width, context.canvas.height];
        const x = this.gameObject.transform.position.x+offset.x;
        const y = this.gameObject.transform.position.y+offset.y;
        const r = this.gameObject.transform.rotation;
        const transformScale = this.gameObject.transform.scale;
        const scale = this.gameObject.gameWorld.getPlugin<CameraPlugin>(CameraPlugin.name).scale;

        const a = radius;
        const cmx = this.gameObject.gameWorld.getPlugin<CameraPlugin>(CameraPlugin.name).cameraPositon.x;
        const cmy = this.gameObject.gameWorld.getPlugin<CameraPlugin>(CameraPlugin.name).cameraPositon.y;

        const cx: number = (x-cmx);
        const cy: number = -(y-cmy);

        context.save();
        
        context.translate(size[0]/2, size[1]/2);
        context.scale(scale, scale);
        context.translate(cx, cy);
        context.rotate(r);
        // context.scale(transformScale.x, transformScale.y);

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