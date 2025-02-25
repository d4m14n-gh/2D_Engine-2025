import { ColliderRendererC } from "../Components/Renderers/ColliderRenderer";
import { RendererC } from "../Components/Renderers/Renderer";
import { BarRendererC } from "../Components/Renderers/BarRenderer";
import { TextRendererC } from "../Components/Renderers/TextRenderer";
import { Color } from "../Helpers/Color";
import { WorldComponent } from "../WorldComponent";
import { CameraPlugin } from "./Camera";
import { ImageRendererC } from "../Components/Renderers/ImageRenderer";
import { PolygonRendererC } from "../Components/Renderers/PolygonRenderer";
import { CanonRendererC } from "../Components/Renderers/CanonRenderer";
import { Vector } from "../Helpers/Vector";

export class RendererPlugin extends WorldComponent {
    private readonly context: CanvasRenderingContext2D;
    public hud: Hud = new Hud();
    
    
    
    constructor(context: CanvasRenderingContext2D) {
        super();
        this.context = context;
    }

    addVignetteEffect(context: CanvasRenderingContext2D, color: string) {
        const centerX = context.canvas.width / 2;
        const centerY = context.canvas.height / 2;
        const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);
        const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
        gradient.addColorStop(0.1, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, color);
        context.fillStyle = gradient;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }

    drawDotGrid(context: CanvasRenderingContext2D, gridSize: number, dotSize: number, dotColor: string) {
        const canvasWidth = context.canvas.width;
        const canvasHeight = context.canvas.height;
        const scale = this.gameWorld.getPlugin<CameraPlugin>(CameraPlugin.name).scale;
        const camera = this.gameWorld.getPlugin<CameraPlugin>(CameraPlugin.name).cameraPositon;

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

    public override start(): void {
        ////
        this.context.imageSmoothingEnabled = true;
        this.context.strokeStyle = "rgb(43,43,44)";
        this.context.lineWidth = 0.175;
        this.context.lineJoin = "round";
        this.context.shadowColor =  'rgba(0, 0, 0, 0.75)';
        ////
    }

    public override update(delta:number, totalDelta: number): void {
        this.context.fillStyle = new Color(113, 111, 107).toString();
        // this.context.clearRect(0, 0, 1920, 1080);
        this.context.fillRect(0, 0, 1920, 1080);
        this.drawDotGrid(this.context, 5, 0.175, "rgb(43,43,44)");
        
        this.gameWorld
        .getComponents(TextRendererC.name)
        .concat(this.gameWorld.getComponents(ColliderRendererC.name))
        .concat(this.gameWorld.getComponents(BarRendererC.name))
        .concat(this.gameWorld.getComponents(ImageRendererC.name))
        .concat(this.gameWorld.getComponents(PolygonRendererC.name))
        .concat(this.gameWorld.getComponents(CanonRendererC.name))
        // .getAllComponents()
        .filter(component => component instanceof RendererC)
        .map(renderer => renderer as RendererC)
        .sort((a, b) => a.zindex-b.zindex).forEach(renderer => renderer.render(this.context));
        // this.gameWorld.getAllComponents<RendererC>(RendererC.name).forEach(renderer => renderer.render(this.context));
        this.hud.draw(this.context);
        this.addVignetteEffect(this.context, 'rgba(0, 0, 0, 0.2)');
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