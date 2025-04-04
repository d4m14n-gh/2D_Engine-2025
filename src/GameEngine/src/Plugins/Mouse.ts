import { Vector } from "../Helpers/Vector";
import { Plugin } from "../Core/Plugin";
import { CameraPlugin } from "./Camera";

export class MousePlugin extends Plugin {
    public name: string = "MousePlugin";
    private readonly pressedKeys = new Set<number>();
    private readonly canvas: HTMLCanvasElement;
    // private readonly canvasSize: Vector;
    private position: Vector = Vector.zero();
    // private worldPosition: Vector = Vector.zero();

    constructor(canvas: HTMLCanvasElement) {
        super();
        this.canvas = canvas;
        this.trackMouse(canvas);
    }
    

    
    public scroll(delta: number): void{
        let camera = this.getPlugin(CameraPlugin);
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
        let scale = this.getPlugin(CameraPlugin).scale;
        let cameraPosition = this.getPlugin(CameraPlugin).cameraPositon;
        const canvasSize = new Vector(this.canvas.width, this.canvas.height);
        let worldPosition = new Vector((this.position.x-canvasSize.x/2)/scale, (-this.position.y+canvasSize.y/2)/scale).add(cameraPosition);
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