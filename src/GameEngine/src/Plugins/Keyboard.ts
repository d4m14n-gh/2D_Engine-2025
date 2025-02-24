import { WorldComponent } from "../WorldComponent";
import { CameraPlugin } from "./Camera";

export class KeyboardPlugin extends WorldComponent {
    private readonly pressedKeys = new Set<string>();;
    
    
    
    
    constructor(pressedKeys: Set<string>) {
        super();
        this.pressedKeys = pressedKeys;
    }
    public isKeyDown(key: string): boolean {
        return this.pressedKeys.has(key);
    }
}