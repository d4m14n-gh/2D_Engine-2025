import { EventArgs, GameEvent } from "../Core/GameEvent";
import { Plugin } from "../Core/Plugin";

export class KeyboardEventArgs extends EventArgs {
    public key: string;
    constructor(key: string) {
        super();
        this.key = key;
    }
}

export class KeyboardPlugin extends Plugin {
    private prevPressedKeys = new Set<string>();
    private readonly pressedKeys = new Set<string>();
    public KeyDownEvent: GameEvent = new GameEvent(); 
    
    constructor(pressedKeys: Set<string>) {
        super();
        this.pressedKeys = pressedKeys;
    }
    public isPressed(key: string): boolean {
        return this.pressedKeys.has(key);
    }


    protected override start(): void {
        this.KeyDownEvent.register(this.gameWorld);
    }
    protected override update(delta: number): void {
        this.pressedKeys.difference(this.prevPressedKeys).forEach(key => this.KeyDownEvent.emit(new KeyboardEventArgs(key)));
        this.prevPressedKeys.clear();
        this.pressedKeys.forEach(key => this.prevPressedKeys.add(key));
    }
}