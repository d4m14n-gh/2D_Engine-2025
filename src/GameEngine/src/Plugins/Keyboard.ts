import { EventArgs, GameEvent } from "../Core/GameEvent";
import { Plugin } from "../Core/Plugin";
import { PluginOrder } from "../Core/PluginOrder";

export class KeyboardEventArgs extends EventArgs {
    public key: string;
    constructor(key: string) {
        super();
        this.key = key;
    }
}

export class KeyboardPlugin extends Plugin {
    public readonly order: PluginOrder = PluginOrder.Input;
    public name: string = "KeyboardPlugin";
    public KeyDownEvent: GameEvent = new GameEvent();
    public BlockedKeyDownEvent: GameEvent = new GameEvent();
    public block: boolean = false;

    private NowPressedKeys = new Set<string>();
    private readonly pressedKeys = new Set<string>();

    constructor() {
        super();
        this.pressedKeys = new Set();
        document.onkeydown = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            this.pressedKeys.add(key);
            this.NowPressedKeys.add(key);
        }
        document.onkeyup = (event: KeyboardEvent) => {
            const key = event.key.toLowerCase();
            this.pressedKeys.delete(key);
        }
    }
    
    public isPressed(key: string): boolean {
        return this.isEnabled() && !this.block && this.pressedKeys.has(key);
    }
    protected override start(): void {
        this.KeyDownEvent.register(this.gameWorld);
        this.BlockedKeyDownEvent.register(this.gameWorld);
    }
    protected override update(delta: number): void {
        this.NowPressedKeys.forEach(key => {
            if (this.block)
                this.BlockedKeyDownEvent.emit(new KeyboardEventArgs(key));
            else
                this.KeyDownEvent.emit(new KeyboardEventArgs(key));
        });
        this.NowPressedKeys.clear();
    }
}