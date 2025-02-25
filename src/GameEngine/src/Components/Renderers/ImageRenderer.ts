import { Vector } from "../../Helpers/Vector";
import { CameraPlugin } from "../../Plugins/Camera";
import { PolygonRendererC } from "./PolygonRenderer";
import { RendererC } from "./Renderer";

export class ImageRendererC extends RendererC {
    private image = new Image();
    public side: Vector;
    public offset: Vector;

    constructor(side: Vector=Vector.zero(), offset: Vector=Vector.zero(),  src: string="GameEngine/src/Assets/vectorpaint2.svg", zindex=0){
        super();
        this.zindex = zindex;
        this.side = side;
        this.offset=offset;
        this.image.src = src;
    }

    public start(): void {
        this.gameObject.getComponent<PolygonRendererC>(PolygonRendererC.name).enabled = false;
    }

    public render(context: CanvasRenderingContext2D): void {
     
        const size = [context.canvas.width, context.canvas.height];
        const x = this.gameObject.transform.position.x;
        const y = this.gameObject.transform.position.y;
        const r = this.gameObject.transform.rotation;
        const transformScale = this.gameObject.transform.scale;
        const scale = this.gameObject.gameWorld.getPlugin<CameraPlugin>(CameraPlugin.name).scale;

        const cmx = this.gameObject.gameWorld.getPlugin<CameraPlugin>(CameraPlugin.name).cameraPositon.x;
        const cmy = this.gameObject.gameWorld.getPlugin<CameraPlugin>(CameraPlugin.name).cameraPositon.y;
        // const color = this.color.toString();

        const cx: number = (x-cmx);
        const cy: number = -(y-cmy);
        let a: Vector = this.side;
        if (a.x==0)
            a.x = this.image.width;
        if (a.y==0)
            a.y = this.image.height;

        context.save();
        
        context.translate(size[0]/2, size[1]/2);
        context.scale(scale, scale);
        context.translate(cx, cy);
        context.rotate(r);
        context.scale(transformScale.x, transformScale.y);
        context.translate(this.offset.x, this.offset.y);

        
        // context.fillStyle = color;
        context.shadowBlur = 30;
       
        context.drawImage(this.image, -a.x/2,  -a.y/2, a.x, a.y);

        context.restore();
    }
}