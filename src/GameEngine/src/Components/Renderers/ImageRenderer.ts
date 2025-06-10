import { Vector } from "../../Helpers/Vector";
import { CameraPlugin } from "../../Plugins/Camera";
import { PolygonRendererC } from "./PolygonRenderer";
import { RendererC } from "./Renderer";

export class ImageRendererC extends RendererC {
    private image = new Image();
    public side: Vector;
    public offset: Vector;

    constructor(side: Vector=Vector.zero(), offset: Vector=Vector.zero(),  src: string="GameEngine/src/Assets/vectorpaint3.svg", zindex=0){
        super();
        this.zindex = zindex;
        this.side = side;
        this.offset=offset;
        this.image.src = src;
    }

    public render(context: CanvasRenderingContext2D): void {
        const world = this.getGameWorld();
        const transform = this.getTransform();
        const camera = this.getPlugin(CameraPlugin);
        if (!world || !transform || !camera) return;


        const x = transform.position.x;
        const y = transform.position.y;
        const r = transform.rotation;
        const scale = transform.scale;

        context.setTransform(camera.getCameraTransform());
        context.translate(x, y);
        context.rotate(r);
        context.scale(scale.x, scale.y);

        
        let a: Vector = this.side;
        if (a.x==0)
            a.x = this.image.width;
        if (a.y==0)
            a.y = this.image.height;

        context.shadowBlur = 15;
        context.drawImage(this.image, -a.x/2,  -a.y/2, a.x, a.y);
        context.shadowBlur = 0;


        context.resetTransform();
    }
}