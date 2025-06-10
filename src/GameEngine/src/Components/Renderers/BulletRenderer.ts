import { rgb } from "../../Helpers/Color";
import { CameraPlugin } from "../../Plugins/Camera";
import { RendererC } from "./Renderer";

export class BulletRendererC extends RendererC {
    public color: rgb;
    public radius: number;

    constructor(side: number, zindex=0, color=rgb.randomColor2()){
        super();
        this.radius = side;
        this.zindex = zindex;
        this.color = color;
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
        
        const color = this.color.toString();
        const size = this.radius;
        const gradientWidth = 4;


        context.setTransform(camera.getCameraTransform());
        context.translate(x, y);
        context.rotate(r);
        context.scale(scale.x, scale.y);


        context.beginPath();
        context.rect(-3*size-gradientWidth, -size, gradientWidth, 2*size);
        context.closePath();
        const grad = context.createLinearGradient(-3*size-gradientWidth, 0, gradientWidth, 0);
        grad.addColorStop(0, this.color.blend(new rgb(255, 255, 255), 0.5).toArgb(0).toString());
        grad.addColorStop(1, this.color.toArgb(0.75).toString());// rgb.stroke.toString());

        context.fillStyle = grad;
        context.shadowBlur = 0;
        context.fill();
      
        context.beginPath();
        context.arc(0, 0, size, 0, 2 * Math.PI);
        context.closePath();
        
        context.fillStyle = color;
        context.shadowBlur = 0; 
        context.fill();
        context.shadowBlur = 50;
        context.stroke();

        context.beginPath();
        context.roundRect(-3*size, -size, 3*size, 2*size, size/2);
        context.closePath();

        context.fillStyle = this.color.blend(rgb.background, 1).toString();
        context.shadowBlur = 0; 
        context.fill();
        context.shadowBlur = 50;
        context.stroke();


        context.resetTransform();
    }
}