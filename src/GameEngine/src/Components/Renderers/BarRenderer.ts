import { rgb } from "../../Helpers/Color";
import { Vector } from "../../Helpers/Vector";
import { CameraPlugin } from "../../Plugins/Camera";
import { RendererC } from "./Renderer";
import { HealthC } from "../Health";

export class BarRendererC extends RendererC {
    public offset: Vector = new Vector(0, 4);
    public fill: number = 0.5;
    public width: number = 5;
    public height: number = 0.5;

    constructor(zindex=0){
        super(zindex);
    }

    public render(context: CanvasRenderingContext2D): void {
        let width = this.width;
        let fill = this.fill;
        try {
            fill = this.getComponent(HealthC).getHealth();
            width = 2+this.getComponent(HealthC).maxHealth/250.0;
        } catch {}
        if(fill>=1||fill<=0)
            return;

        const x = this.getTransform().position.x;
        const y = this.getTransform().position.y;
        const transformScale = this.getTransform().scale;
        const scale = this.getGameWorld().getPlugin(CameraPlugin).scale;
        const offset = this.getGameWorld().getPlugin(CameraPlugin).cameraScreenOffset;

        const cmx = this.getGameWorld().getPlugin(CameraPlugin).cameraPositon.x;
        const cmy = this.getGameWorld().getPlugin(CameraPlugin).cameraPositon.y;
        const color = rgb.getHeatmapColor(fill).toString();

        const cx: number = (x-cmx);
        const cy: number = (y-cmy);
        const radius = 0.25;


        
        context.translate(offset.x, offset.y);
        context.scale(scale.x, scale.y);
        context.translate(cx, cy);
        // context.rotate(r);
        context.scale(transformScale.x, transformScale.y);
        context.translate(this.offset.x, this.offset.y);

        
        context.fillStyle = color;
        context.shadowBlur = 0;
        
        context.beginPath();
        context.roundRect(-width/2, -this.height/2, width, this.height, radius);
        context.closePath();
        context.fillStyle = rgb.background.toString();
        context.fill();
        
        context.beginPath();
        context.roundRect(-width/2, -this.height/2, width*fill, this.height, radius);
        context.closePath();
        context.fillStyle = color;
        context.fill();
        
        context.beginPath();
        context.roundRect(-width/2, -this.height/2, width, this.height, radius);
        context.closePath();
        context.shadowBlur = 30;
        context.stroke();
        
        context.beginPath();
        context.roundRect(-width/2, -this.height/2, width*fill, this.height, radius);
        context.closePath();
        context.shadowBlur = 0;
        context.stroke();

        context.setTransform(1, 0, 0, 1, 0, 0);
    }
}