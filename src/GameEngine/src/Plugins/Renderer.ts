import { ColliderRendererC } from "../Components/Renderers/ColliderRenderer";
import { RendererC } from "../Components/Renderers/Renderer";
import { rgb } from "../Helpers/Color";
import { Plugin } from "../Core/Plugin";
import { CameraPlugin } from "./Camera";
// import { ImageRendererC } from "../Components/Renderers/ImageRenderer";
import { PolygonRendererC } from "../Components/Renderers/PolygonRenderer";
// import { CanonRendererC } from "../Components/Renderers/CanonRenderer";
import { Vector } from "../Helpers/Vector";
import { GOManagerPlugin } from "./GOManager";
import { TextRendererC } from "../Components/Renderers/TextRenderer";
import { BarRendererC } from "../Components/Renderers/BarRenderer";
import { ChasisRendererC } from "../Components/Renderers/ChasisRenderer";
// import { TracesRendererC } from "../Components/Renderers/TracesRenderer";


export class RendererPlugin extends Plugin {
    public name: string = "RendererPlugin";
    private readonly context: CanvasRenderingContext2D;
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
        for(let i=0;i<10;i++){
            this.gridCanvas[i] = document.createElement("canvas");
            this.gridCanvas[i].width = 3440;
            this.gridCanvas[i].height = 1440;
            document.createElement("canvas");
            const offscreen = this.gridCanvas[i].transferControlToOffscreen();
            worker.postMessage({ canvas: offscreen, args: [new Vector(2, 2), 0.175, rgb.stroke.toString(), new Vector(i*5+5, i*5+5)] }, [offscreen]);
        }
        
    }

    private clip(position: Vector): boolean{
        const width = this.context.canvas.width;
        const height = this.context.canvas.height;
        
        const scale = this.getPlugin(CameraPlugin).scaleV;
        const cameraPositon = this.getPlugin(CameraPlugin).cameraPosition;
        const xClip = Math.abs(width/2/scale.x);  
        const yClip = Math.abs(height/2/scale.y);
          
        return Math.abs(position.x-cameraPositon.x) > xClip || Math.abs(position.y-cameraPositon.y) > yClip;
    }
    public override update(delta:number): void {
        const width = this.context.canvas.width;
        const height = this.context.canvas.height;
        // this.context.fillStyle ="rgb(66, 85, 68)";
        // this.context.fillStyle ="rgb(105, 111, 105)";
        this.context.fillStyle ="rgba(80, 100, 81, 1)";
        this.context.fillRect(0, 0, width, height);
        this.getPlugin(CameraPlugin).cameraScreenOffset = new Vector(this.context.canvas.width/2, this.context.canvas.height/2);



        // let gx = Math.sqrt(3);
        // let gy = 3;
        let gx = 2;
        let gy = 2;
        const offset = this.getPlugin(CameraPlugin).cameraScreenOffset;
        const scale = this.getPlugin(CameraPlugin).scaleV;
        const cpos = this.getPlugin(CameraPlugin).cameraPosition;
        let i = Math.max(0, Math.min(9, Math.round(scale.x/10)));
        let c = i * 5 + 5;
        this.context.translate(offset.x, offset.y);
        this.context.scale(scale.x, scale.y);
        this.context.translate((-cpos.x)%gx, (-cpos.y)%gy);
        this.context.scale(1/c, 1/c);
        this.context.drawImage(this.gridCanvas[i], -this.gridCanvas[i].width/2, -this.gridCanvas[i].height/2, this.gridCanvas[i].width, this.gridCanvas[i].height);
        this.context.setTransform(1, 0, 0, 1, 0, 0);

        
        
        (this.getPlugin(GOManagerPlugin).getComponents(TextRendererC) as RendererC[])
        .concat(this.getPlugin(GOManagerPlugin).getComponents(ColliderRendererC) as RendererC[])
        .concat(this.getPlugin(GOManagerPlugin).getComponents(PolygonRendererC) as RendererC[])
        .concat(this.getPlugin(GOManagerPlugin).getComponents(BarRendererC)as RendererC[])
        // .concat(this.app.getComponents(ImageRendererC)as RendererC[])
        .filter(renderer => !this.clip(renderer.gameObject!.getBody()!.getPosition()))
        // .concat(this.app.getComponents(CanonRendererC)as RendererC[])
        // .concat(this.app.getComponents(TracesRendererC)as RendererC[])
        .concat(this.getPlugin(GOManagerPlugin).getComponents(ChasisRendererC)as RendererC[])
        .filter(renderer => !this.clip(renderer.gameObject!.getBody()!.getPosition()))
        .sort((a, b) => a.zindex-b.zindex).forEach(renderer => renderer.render(this.context));
        // this.gameWorld.getAllComponents<RendererC>(RendererC.name).forEach(renderer => renderer.render(this.context));
        this.addVignetteEffect(this.context, 'rgba(0, 0, 0, 0.35)');
    }
}