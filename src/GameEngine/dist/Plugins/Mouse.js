import { Vector } from "../Helpers/Vector";
import { Plugin } from "../Core/Plugin";
import { CameraPlugin } from "./Camera";
export class MousePlugin extends Plugin {
    pressedKeys = new Set();
    canvas;
    // private readonly canvasSize: Vector;
    position = Vector.zero();
    // private worldPosition: Vector = Vector.zero();
    constructor(canvas) {
        super();
        this.canvas = canvas;
        this.trackMouse(canvas);
    }
    scroll(delta) {
        let camera = this.getPlugin(CameraPlugin);
        delta = Math.sign(delta);
        if (delta > 0 && camera.targetScale * 0.9 > 5)
            camera.targetScale = 0.9 * camera.targetScale;
        if (delta < 0 && camera.targetScale * 1.1 < 100)
            camera.targetScale = 1.1 * camera.targetScale;
    }
    isKeyDown(key = 0) {
        return this.pressedKeys.has(key);
    }
    getWorldPosition() {
        let scale = this.getPlugin(CameraPlugin).scale;
        let cameraPosition = this.getPlugin(CameraPlugin).cameraPositon;
        const canvasSize = new Vector(this.canvas.width, this.canvas.height);
        let worldPosition = new Vector((this.position.x - canvasSize.x / 2) / scale, (-this.position.y + canvasSize.y / 2) / scale).add(cameraPosition);
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
            this.scroll(event.deltaY);
        });
    }
}
