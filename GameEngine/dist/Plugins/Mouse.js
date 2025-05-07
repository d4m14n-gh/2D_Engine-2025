import { Vector } from "../Helpers/Vector";
import { Plugin } from "../Core/Plugin";
import { EventArgs, GameEvent } from "../Core/GameEvent";
export class MouseScrollEventArgs extends EventArgs {
    delta;
    constructor(delta) {
        super();
        this.delta = delta;
    }
}
export class MousePlugin extends Plugin {
    name = "MousePlugin";
    mouseScrollYEvent = new GameEvent();
    pressedKeys = new Set();
    canvas;
    position = Vector.zero();
    constructor(canvas) {
        super();
        this.canvas = canvas;
        this.trackMouse(canvas);
    }
    start() {
        this.mouseScrollYEvent.register(this.gameWorld);
    }
    isKeyDown(key = 0) {
        return this.pressedKeys.has(key);
    }
    getMouseScreenPosition() {
        const canvasSize = new Vector(this.canvas.width, this.canvas.height);
        let worldPosition = new Vector((this.position.x), (this.position.y));
        return worldPosition;
    }
    trackMouse(canvas) {
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
            this.mouseScrollYEvent.emit(new MouseScrollEventArgs(event.deltaY));
        });
    }
}
