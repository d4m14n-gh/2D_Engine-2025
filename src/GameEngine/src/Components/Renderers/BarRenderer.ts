import { Color } from "../../Helpers/Color";
import { Component } from "../../Component";
import { RendererPlugin } from "../../Plugins/Renderer";
import { GameObject } from "../../GameObject";
import { Vector } from "../../Helpers/Vector";
import { CameraPlugin } from "../../Plugins/Camera";
import { RendererC } from "../Renderer";
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
            fill = this.gameObject.getComponent<HealthC>(HealthC.name).getHealth();
            width = 2+this.gameObject.getComponent<HealthC>(HealthC.name).maxHealth/250.0;
        } catch {}
        if(fill>=1||fill<=0)
            return;

        const size = [context.canvas.width, context.canvas.height];
        const x = this.gameObject.transform.position.x;
        const y = this.gameObject.transform.position.y;
        const transformScale = this.gameObject.transform.scale;
        const scale = this.gameObject.gameWorld.getPlugin<CameraPlugin>(CameraPlugin.name).scale;

        const cmx = this.gameObject.gameWorld.getPlugin<CameraPlugin>(CameraPlugin.name).cameraPositon.x;
        const cmy = this.gameObject.gameWorld.getPlugin<CameraPlugin>(CameraPlugin.name).cameraPositon.y;
        const color = Color.getHeatmapColor(fill).toString();

        const cx: number = (x-cmx);
        const cy: number = -(y-cmy);


        context.save();
        
        context.translate(size[0]/2, size[1]/2);
        context.scale(scale, scale);
        context.translate(cx, cy);
        // context.rotate(r);
        context.scale(transformScale.x, transformScale.y);
        context.translate(this.offset.x, -this.offset.y);


        // context.shadowBlur = 0;
        // context.fillRect(-a, -a, 2*a, 2*a);
        // context.shadowBlur = 30;
        // context.strokeRect(-a, -a, 2*a, 2*a);

        context.fillStyle = Color.background.toString();
        context.fillRect(-width/2, -this.height/2, width, this.height);
        context.fillStyle = color;
        context.fillRect(-width/2, -this.height/2, width*fill, this.height);
        context.strokeRect(-width/2, -this.height/2, width, this.height);

        context.restore();
    }
}