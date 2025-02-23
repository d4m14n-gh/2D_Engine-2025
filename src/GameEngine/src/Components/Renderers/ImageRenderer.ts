import { Color } from "../../Helpers/Color";
import { Vector } from "../../Helpers/Vector";
import { CameraPlugin } from "../../Plugins/Camera";
import { ConfigPlugin } from "../../Plugins/Config";
import { RendererC } from "../Renderer";

export class ImageRendererC extends RendererC {
    private image = new Image();
    public side: number;
    public offset: Vector;

    constructor(side: number=1, offset: Vector=Vector.zero(),  src: string="GameEngine/src/Assets/tank.png", zindex=0, color=Color.randomColor2()){
        super();
        this.color = color;
        this.zindex = zindex;
        this.side = side;
        this.offset=offset;
        this.image.src = src;
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
        const color = this.color.toString();

        const cx: number = (x-cmx);
        const cy: number = -(y-cmy);
        const a: number = this.side;

        context.save();
        
        context.translate(size[0]/2, size[1]/2);
        context.scale(scale, scale);
        context.translate(cx, cy);
        context.rotate(r);
        context.scale(transformScale.x, transformScale.y);
        context.translate(this.offset.x, this.offset.y);

        
        context.fillStyle = color;
        context.shadowBlur = 30;
       
        context.drawImage(this.image, -a/2,  -a/2, a, a);

        context.restore();
    }
}