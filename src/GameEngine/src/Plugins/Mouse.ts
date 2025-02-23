import { SquareRendererC } from "../Components/Renderers/SquareRenderer";
import { Vector } from "../Helpers/Vector";
import { WorldComponent } from "../WorldComponent";
import { CameraPlugin } from "./Camera";

export class MousePlugin extends WorldComponent {
    private readonly pressedKeys = new Set<number>();
    private readonly canvasSize: Vector;
    private position: Vector = Vector.zero();
    // private worldPosition: Vector = Vector.zero();

    constructor(canvas: HTMLCanvasElement) {
        super();
        this.canvasSize = new Vector(canvas.width, canvas.height);
        this.trackMouse(canvas);
    }
    
    
    public scroll(delta: number): void{
        let camera = this.gameWorld.getPlugin<CameraPlugin>(CameraPlugin.name);
        delta = Math.sign(delta);
        if(delta>0&&camera.targetScale*0.9>5)
            camera.targetScale=0.9*camera.targetScale;
        if(delta<0&&camera.targetScale*1.1<100)
            camera.targetScale=1.1*camera.targetScale;
    }
    public isKeyDown(key: number=0): boolean {
        return this.pressedKeys.has(key);
    }
    public getWorldPosition(): Vector{
        let scale = this.gameWorld.getPlugin<CameraPlugin>(CameraPlugin.name).scale;
        let cameraPosition = this.gameWorld.getPlugin<CameraPlugin>(CameraPlugin.name).cameraPositon;
        let worldPosition = new Vector((this.position.x-this.canvasSize.x/2)/scale, (-this.position.y+this.canvasSize.y/2)/scale).add(cameraPosition);
        return worldPosition;
    }

    public trackMouse(canvas: HTMLCanvasElement): void {
        canvas.addEventListener("mousemove", (event) => {
            const rect = canvas.getBoundingClientRect();
            let x = event.clientX - rect.left;
            let y = event.clientY - rect.top;
            this.position = new Vector(x, y);
        });
        canvas.addEventListener("mousedown", (event) => {
            this.pressedKeys.add(event.button);
        });
        canvas.addEventListener("mouseup", (event) => {
            this.pressedKeys.delete(event.button);
        });    
        canvas.addEventListener("wheel", (event) => {
            this.scroll(event.deltaY)
        });
    }
}