import { rgb } from "../../Helpers/Color";
import { Vector } from "../../Helpers/Vector";
import { CameraPlugin } from "../../Plugins/Camera";
import { RendererC } from "./Renderer";
import { HealthC } from "../Health";
import { GMath } from "../../Helpers/Math";

export class BarRendererC extends RendererC {
    public offset: Vector = new Vector(0, 4);
    public fill: number = 0.5;
    public width: number = 5;
    public height: number = 0.5;

    constructor(zindex=0){
        super(zindex);
    }

    public render(context: CanvasRenderingContext2D): void {
        const world = this.getGameWorld();
        const transform = this.getTransform();
        const health = this.getComponent(HealthC);
        const camera = this.getPlugin(CameraPlugin);
        if (!world || !transform || !health || !camera) return;


        const x = transform.position.x;
        const y = transform.position.y;
        const r = transform.rotation;
        const scale = transform.scale;
      
        
        const fill = GMath.minmax(health.getHealth(), 0, 1);
        const width = 2+health.maxHealth/250.0;
        const color = rgb.getHeatmapColor(fill).toString();
        const color2 = rgb.background.toString();
        const radius = 0.25;

        
        context.setTransform(camera.getCameraTransform());
        context.translate(x, y);
        // context.rotate(r);
        context.scale(scale.x, scale.y);
        
        context.translate(this.offset.x, this.offset.y);

        
        context.shadowBlur = 0;
        
        context.beginPath();
        context.roundRect(-width/2, -this.height/2, width, this.height, radius);
        context.closePath();
        context.fillStyle = color2;
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


        context.resetTransform();
    }
}