import { c } from "vite/dist/node/moduleRunnerTransport.d-DJ_mE5sf";
import { GameWorld } from "../../Core/GameWorld";
import { rgb } from "../../Helpers/Color";
import { CameraPlugin } from "../../Plugins/Camera";
import { ConfigPlugin } from "../../Plugins/Config";
import { ColliderC } from "../Collider";
import { RendererC } from "./Renderer";

export class ColliderRendererC extends RendererC {
    private activeColor: rgb = new rgb(172, 42, 55, 0.125);
    private staticColor: rgb = new rgb(95, 64, 36, 0.125);
    private dynamicColor: rgb = new rgb(57, 127, 31, 0.125);
    private disabledColor: rgb = new rgb(36, 24, 36, 0.125);

    constructor(zindex=-1){
        super();
        this.zindex = zindex;
    }
    
    public getColor(): rgb{
        let color: rgb = this.dynamicColor; 
        let collider = this.getComponent(ColliderC);
        
        if (!collider) 
            color = this.disabledColor;
        else if (!collider.isEnabled())
            color = this.disabledColor;
        else if (collider.isActive)
            color = this.activeColor;
        else if(collider.isStatic)
            color = this.staticColor;
        return color;
    }
    
    public render(context: CanvasRenderingContext2D): void {
        let display = this.getPlugin(ConfigPlugin)?.get("displayColliders")??false;
        if(!display)
            return;

        const world = this.getGameWorld();
        const transform = this.getTransform();
        const camera = this.getPlugin(CameraPlugin);
        const collider = this.getComponent(ColliderC);
        if (!world || !transform || !camera || !collider) return;


        const x = transform.position.x;
        const y = transform.position.y;
        const r = transform.rotation;
        const scale = transform.scale;
        
        const color: rgb = this.getColor();
        const colliderOffset = collider.offset;
        const radius = collider.radius;
        const radius2 = collider.radius + 0.25;

        context.save();
        context.setTransform(camera.getCameraTransform());
        context.translate(x, y);
        context.rotate(r);
        context.scale(scale.x, scale.y);
    

        context.strokeStyle = color.toRgb().toString();
        context.fillStyle = color.toString();
        context.shadowBlur = 30;
        context.beginPath();
        context.arc(0, 0, radius2, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
        context.stroke();

        context.beginPath();
        context.arc(0, 0, radius, 0, 2 * Math.PI);
        context.closePath();
        context.lineWidth = 0.1;
        context.stroke();


        context.restore();
    }
}