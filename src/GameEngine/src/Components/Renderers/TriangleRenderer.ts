import { Color } from "../../Helpers/Color";
import { Component } from "../../Component";
import { RendererPlugin } from "../../Plugins/Renderer";
import { GameObject } from "../../GameObject";
import { Vector } from "../../Helpers/Vector";
import { CameraPlugin } from "../../Plugins/Camera";
import { RendererC } from "../Renderer";
import { ColliderC } from "../Collider";

export class TriangleRendererC extends RendererC {
    public color: Color = new Color(42, 42, 55);
    public side: number;

    constructor(side: number, zindex=0, color=Color.randomColor2()){
        super();
        this.side = side;
        this.zindex = zindex;
        this.color = color;
    }

    public render(context: CanvasRenderingContext2D): void {

        const size = [context.canvas.width, context.canvas.height];
        const x = this.gameObject.transform.position.x;
        const y = this.gameObject.transform.position.y;
        const r = this.gameObject.transform.rotation;
        const transformScale = this.gameObject.transform.scale;
        const scale = this.gameObject.gameWorld.getPlugin<CameraPlugin>(CameraPlugin.name).scale;

        const a = this.side/2;
        const h = a*Math.sqrt(3)/3;
        const cmx = this.gameObject.gameWorld.getPlugin<CameraPlugin>(CameraPlugin.name).cameraPositon.x;
        const cmy = this.gameObject.gameWorld.getPlugin<CameraPlugin>(CameraPlugin.name).cameraPositon.y;
        const color = this.color.toString();

        const cx: number = (x-cmx);
        const cy: number = -(y-cmy);


        context.save();
        
        context.fillStyle = color;
        context.translate(size[0]/2, size[1]/2);
        context.scale(scale, scale);
        context.translate(cx, cy);
        context.rotate(r);
        context.scale(transformScale.x, transformScale.y);
        
        context.beginPath();
        context.moveTo(-a, h);
        context.lineTo(0, -h*2);
        context.lineTo(a, h);
        context.closePath();
       
        context.shadowBlur = 0;
        context.fill();
        context.shadowBlur = 30;
        context.stroke();
        
        context.restore();
    }
}