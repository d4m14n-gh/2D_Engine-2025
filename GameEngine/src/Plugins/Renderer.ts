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
        gradient.addColorStop(0.25, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, color);
        context.fillStyle = gradient;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }

    drawDotGrid(context: CanvasRenderingContext2D, gridSize: number, dotSize: number, dotColor: string) {
        const canvasWidth = context.canvas.width;
        const canvasHeight = context.canvas.height;
        const scale = this.getPlugin(CameraPlugin).scale;
        const camera = this.getPlugin(CameraPlugin).cameraPositon;

        gridSize *= scale;
        dotSize *= scale;
        context.fillStyle = dotColor;

        for (let x =  (canvasWidth/2-camera.x*scale)%gridSize; x <= canvasWidth; x += gridSize) {
            for (let y = (canvasHeight/2+camera.y*scale)%gridSize; y <= canvasHeight; y += gridSize) {
                context.beginPath();
                context.arc(x, y, dotSize / 2, 0, Math.PI * 2);
                context.fill();
            }
        }
    }

    drawGrid(context: CanvasRenderingContext2D, gridSize: number, lineColor: string) {
        const canvasWidth = context.canvas.width;
        const canvasHeight = context.canvas.height;
        const scale = this.getPlugin(CameraPlugin).scale;
        const camera = this.getPlugin(CameraPlugin).cameraPositon;

        context.save();
        gridSize *= scale;
        context.strokeStyle = lineColor;
        context.lineWidth = 0.1 * scale;

        context.beginPath();

        for (let x = (canvasWidth / 2 - camera.x * scale) % gridSize; x <= canvasWidth; x += gridSize) {
            context.moveTo(x, 0);
            context.lineTo(x, canvasHeight);
        }

        for (let y = (canvasHeight / 2 + camera.y * scale) % gridSize; y <= canvasHeight; y += gridSize) {
            context.moveTo(0, y);
            context.lineTo(canvasWidth, y);
        }

        context.stroke();
        context.restore();
    }

    public override start(): void {
        ////
        this.context.imageSmoothingEnabled = true;
        this.context.strokeStyle = "rgb(43,43,44)";
        this.context.lineWidth = 0.175;
        this.context.lineJoin = "round";
        this.context.shadowColor =  'rgba(0, 0, 0, 0.75)';
        ////
    }

    public override update(delta:number): void {
        const width = this.context.canvas.width;
        const height = this.context.canvas.height;
        // this.context.fillStyle = new Color(113, 111, 107).toString();
        this.context.fillStyle = "#716f6b";
        this.context.fillStyle ="rgb(85, 106, 86)";
        this.context.fillRect(0, 0, width, height);
        this.drawGrid(this.context, 10, "rgb(43,43,44)");
        // this.drawDotGrid(this.context, 10, 0.175, "rgb(43,43,44)");
        
        (this.gameWorld.getComponents(TextRendererC) as RendererC[])
        .concat(this.gameWorld.getComponents(ColliderRendererC) as RendererC[])
        .concat(this.gameWorld.getComponents(BarRendererC)as RendererC[])
        .concat(this.gameWorld.getComponents(PolygonRendererC)as RendererC[])
        .concat(this.gameWorld.getComponents(ImageRendererC)as RendererC[])
        .concat(this.gameWorld.getComponents(CanonRendererC)as RendererC[])
        .concat(this.gameWorld.getComponents(TracesRendererC)as RendererC[])
        .concat(this.gameWorld.getComponents(ChasisRendererC)as RendererC[])
        .filter(renderer => renderer.getTransform().position.distance(this.getPlugin(CameraPlugin).cameraPositon)<this.renderDistance)
        .sort((a, b) => a.zindex-b.zindex).forEach(renderer => renderer.render(this.context));
        // this.gameWorld.getAllComponents<RendererC>(RendererC.name).forEach(renderer => renderer.render(this.context));
        this.hud.draw(this.context);
        this.addVignetteEffect(this.context, 'rgba(0, 0, 0, 0.3)');
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