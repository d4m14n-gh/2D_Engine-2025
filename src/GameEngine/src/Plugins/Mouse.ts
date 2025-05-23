import { Vector } from "../Helpers/Vector";
import { Plugin } from "../Core/Plugin";
import { EventArgs, GameEvent } from "../Core/GameEvent";

export class MouseScrollEventArgs extends EventArgs{
    public delta: number;
    constructor(delta: number){
        super();
        this.delta = delta;
    }
}

export class MouseClickEventArgs extends EventArgs{
    public button: number;
    constructor(button: number){
        super();
        this.button = button;
    }
}

export class MousePlugin extends Plugin {
    public name: string = "MousePlugin";
    public mouseScrollYEvent = new GameEvent();
    public mouseDownEvent = new GameEvent();
    public mouseUpEvent = new GameEvent();
    private readonly pressedKeys = new Set<number>();
    private readonly canvas: HTMLCanvasElement;
    private position: Vector = Vector.zero();

    constructor(canvas: HTMLCanvasElement) {
        super();
        this.canvas = canvas;
        this.trackMouse(canvas);
    }
    
    protected override start(): void {
        this.mouseScrollYEvent.register(this.gameWorld);
        this.mouseDownEvent.register(this.gameWorld);
        this.mouseUpEvent.register(this.gameWorld);
    } 
   
    public isKeyDown(key: number=0): boolean {
        return this.pressedKeys.has(key);
    }

    public getMouseScreenPosition(): Vector{
        const scale = window.devicePixelRatio || 1;
        // const canvasSize = new Vector(this.canvas.width, this.canvas.height);
        let screenPosition = new Vector((this.position.x*scale), (this.position.y*scale));
        return screenPosition;
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
            this.mouseDownEvent.emit(new MouseClickEventArgs(event.button));
        });
        canvas.addEventListener("mouseup", (event) => {
            this.pressedKeys.delete(event.button);
            this.mouseUpEvent.emit(new MouseClickEventArgs(event.button));
        });    
        canvas.addEventListener("wheel", (event) => {
            this.mouseScrollYEvent.emit(new MouseScrollEventArgs(event.deltaY))
        });
    }
}