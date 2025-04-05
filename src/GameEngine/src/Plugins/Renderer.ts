import { ColliderRendererC } from "../Components/Renderers/ColliderRenderer";
import { RendererC } from "../Components/Renderers/Renderer";
import { BarRendererC } from "../Components/Renderers/BarRenderer";
import { TextRendererC } from "../Components/Renderers/TextRenderer";
import { rgb } from "../Helpers/Color";
import { Plugin } from "../Core/Plugin";
import { CameraPlugin } from "./Camera";
import { ImageRendererC } from "../Components/Renderers/ImageRenderer";
import { PolygonRendererC } from "../Components/Renderers/PolygonRenderer";
import { CanonRendererC } from "../Components/Renderers/CanonRenderer";
import { Vector } from "../Helpers/Vector";
import { ChasisRendererC } from "../Components/Renderers/ChasisRenderer";
import { TracesRendererC } from "../Components/Renderers/TracesRenderer";
import { timingSafeEqual } from "crypto";


export class RendererPlugin extends Plugin {
    public name: string = "RendererPlugin";
    private readonly context: CanvasRenderingContext2D;
    public hud: Hud = new Hud();
    public renderDistance: number = 150;
    
    
    
    constructor(context: CanvasRenderingContext2D) {
        super();
        this.context = context;
    }

    addVignetteEffect(context: CanvasRenderingContext2D, color: string) {
        const centerX = context.canvas.width / 2;
        const centerY = context.canvas.height / 2;
        const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);
        const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
        gradient.addColorStop(0.025, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, color);
        context.fillStyle = gradient;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }

  

    drawGrid(context: CanvasRenderingContext2D, gridSize: Vector, dotSize: number, lineColor: string, scale: Vector) {
        const canvasWidth = context.canvas.width;
        const canvasHeight = context.canvas.height;
        context.save();
        gridSize.x *= Math.abs(scale.x);
        gridSize.y *= Math.abs(scale.y);
        context.strokeStyle = lineColor;
        context.lineWidth = dotSize * scale.x;
        context.beginPath();
        for (let x = (canvasWidth / 2) % gridSize.x; x <= canvasWidth; x += gridSize.x) {
            context.moveTo(x, 0);
            context.lineTo(x, canvasHeight);
        }

        for (let y = (canvasHeight / 2) % gridSize.y; y <= canvasHeight; y += gridSize.y) {
            context.moveTo(0, y);
            context.lineTo(canvasWidth, y);
        }
        context.stroke();
        context.restore();
    }
  

    private gridCanvas: HTMLCanvasElement[] = [];
    public override start(): void {
        ////
        this.context.imageSmoothingEnabled = true;
        this.context.strokeStyle = "rgb(43,43,44)";
        this.context.lineWidth = 0.175;
        this.context.lineJoin = "round";
        this.context.shadowColor =  'rgba(0, 0, 0, 0.75)';
        this.context.fillStyle = "#716f6b";
        this.context.fillStyle ="rgb(85, 106, 86)";
        this.context.fillStyle ="rgb(66, 85, 68)";
        ////
        let worker = new Worker(new URL("../Components/Renderers/BackgroundRenderer.ts", import.meta.url), { type: 'module' }); //this.drawDotGrid(ctx, new Vector(2.5, 2.5), 0.175, rgb.stroke.toString(), new Vector(i*4+5, i*4+5));
        for(let i=0;i<6;i++){
            this.gridCanvas[i] = document.createElement("canvas");
            this.gridCanvas[i].width = 3440;
            this.gridCanvas[i].height = 1440;
            document.createElement("canvas");
            const offscreen = this.gridCanvas[i].transferControlToOffscreen();
            worker.postMessage({ canvas: offscreen, args: [new Vector(2.5, 2.5), 0.175, rgb.stroke.toString(), new Vector(i*4+5, i*4+5)] }, [offscreen]);
            // const ctx = this.gridCanvas[i].getContext("2d");
            // if(ctx) {

            // }
                // this.drawHexGrid(ctx, new Vector(2.5, 2.5), 0.05, rgb.stroke.toString(), new Vector(i*4+5, i*4+5));
        }
        
    }

    private clip(position: Vector): boolean{
        const width = this.context.canvas.width;
        const height = this.context.canvas.height;
        
        const scale = this.getPlugin(CameraPlugin).scale;
        const cameraPositon = this.getPlugin(CameraPlugin).cameraPositon;
        const xClip = Math.abs(width/2/scale.x);  
        const yClip = Math.abs(height/2/scale.y);
          
        return Math.abs(position.x-cameraPositon.x) > xClip || Math.abs(position.y-cameraPositon.y) > yClip;
    }
    public override update(delta:number): void {
        const width = this.context.canvas.width;
        const height = this.context.canvas.height;
        // this.context.fillStyle = new Color(113, 111, 107).toString();
       
        this.getPlugin(CameraPlugin).cameraOffset = new Vector(this.context.canvas.width/2, this.context.canvas.height/2);
        // this.drawDotGrid(this.context, 10, 0.175, "rgb(43,43,44)");
        
        this.context.fillStyle ="rgb(66, 85, 68)";
        this.context.fillStyle ="rgb(105, 111, 105)";
        // (rgb as any).background = new rgb(80, 100, 81);
        this.context.fillStyle ="rgba(80, 100, 81, 1)";
        this.context.fillRect(0, 0, width, height);



        this.context.save();
        let gx = Math.sqrt(3)*2.5;
        let gy = 3*2.5;
        // let gx = 2.5;
        // let gy = 2.5;
        const offset = this.getPlugin(CameraPlugin).cameraOffset;
        const scale = this.getPlugin(CameraPlugin).scale;
        // const scale = new Vector(5, 5);
        const cpos = this.getPlugin(CameraPlugin).cameraPositon;
        let i = Math.max(0, Math.min(5, Math.round(scale.x/10)));
        let c = i * 4 + 5;
        this.context.translate(offset.x, offset.y);
        this.context.scale(scale.x, scale.y);
        this.context.translate((-cpos.x)%gx, (-cpos.y)%gy);
        this.context.scale(1/c, 1/c);
        // this.context.imageSmoothingEnabled = false;
        this.context.drawImage(this.gridCanvas[i], -this.gridCanvas[i].width/2, -this.gridCanvas[i].height/2, this.gridCanvas[i].width, this.gridCanvas[i].height);
        this.context.restore();



        (this.gameWorld.getComponents(TextRendererC) as RendererC[])
        .concat(this.gameWorld.getComponents(ColliderRendererC) as RendererC[])
        .concat(this.gameWorld.getComponents(BarRendererC)as RendererC[])
        .concat(this.gameWorld.getComponents(PolygonRendererC)as RendererC[])
        .concat(this.gameWorld.getComponents(ImageRendererC)as RendererC[])
        .concat(this.gameWorld.getComponents(CanonRendererC)as RendererC[])
        .concat(this.gameWorld.getComponents(TracesRendererC)as RendererC[])
        .concat(this.gameWorld.getComponents(ChasisRendererC)as RendererC[])
        .filter(renderer => !this.clip(renderer.getTransform().position))
        .sort((a, b) => a.zindex-b.zindex).forEach(renderer => renderer.render(this.context));
        // this.gameWorld.getAllComponents<RendererC>(RendererC.name).forEach(renderer => renderer.render(this.context));
        this.hud.draw(this.context);
        this.addVignetteEffect(this.context, 'rgba(0, 0, 0, 0.5)');
    }
}

export class Hud{
    private texts: Map<string, {pos: Vector, text: string}> = new Map();

    public setLabel(key: string, pos: Vector, text: string): void{
        this.texts.set(key, {pos, text});
    }
    
    public removeLabel(key: string): void{
        this.texts.delete(key);
    }

    public draw(context: CanvasRenderingContext2D){
        for (const element of this.texts.values())
            this.drawText(element.text, element.pos, context);
    }
    private drawText(text: string, position: Vector, context: CanvasRenderingContext2D): void{
        context.save();

        context.translate(position.x, position.y);

        const textHeight = 30.0;
        context.font = "bold "+textHeight+"px Arial";
        context.fillStyle = "azure";
        context.lineWidth = 0.175*30;
        const offset = 0;//context.measureText(text).width/2;
        
        context.strokeText(text, -offset, textHeight/4);
        context.fillText(text, -offset, textHeight/4);

        context.restore();
    } 
}