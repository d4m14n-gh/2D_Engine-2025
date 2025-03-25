import { Plugin } from "../Core/Plugin";

export class KeyboardPlugin extends Plugin {
    private readonly pressedKeys = new Set<string>();;
    
    
    
    
    constructor(pressedKeys: Set<string>) {
        super();
        this.pressedKeys = pressedKeys;
    }
    public isKeyDown(key: string): boolean {
        return this.pressedKeys.has(key);
    }
}