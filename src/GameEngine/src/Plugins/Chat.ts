import { RigidBodyC } from "../Components/RigidBody";
import { EventArgs, GameEvent } from "../Core/GameEvent";
import { Plugin } from "../Core/Plugin";
import { Vector } from "../Helpers/Vector";
import { KeyboardEventArgs, KeyboardPlugin } from "./Keyboard";
import { PlayerPlugin } from "./Player";
import { RendererPlugin } from "./Renderer";

export class ChatEventArgs extends EventArgs {
    public message: string;
    constructor(message: string) {
        super();
        this.message = message;
        
    }
}

export class ChatPlugin extends Plugin {

    public name: string = "ChatPlugin";
    private chatMessages: string[] = [];
    private isListening: boolean = false;
    private message: string = "";
    public chatMessageEvent: GameEvent = new GameEvent();

    protected override start(): void {
        this.getPlugin(KeyboardPlugin)?.KeyDownEvent.subscribe(this, "KeyDownEvent");
        this.chatMessageEvent.register(this.gameWorld);
        this.drawChatWriteMessage(">");
    }

    protected override update(delta: number): void {

    }

    protected override event(args: EventArgs, alias?: string): void {
        const keyboardArgs = args as KeyboardEventArgs;
        if (keyboardArgs.key === "enter") {
            if (this.isListening && this.message.length > 0) {
                this.sendChatMessage(this.message);
                this.message = "";
            }
            this.isListening = !this.isListening;
        } else if (keyboardArgs.key === "backspace") {
            this.message = this.message.slice(0, -1);
        } else if (keyboardArgs.key === "escape") {
            this.isListening = false;
            this.message = "";
        } else if (this.isListening) {
            this.message += keyboardArgs.key;
        }

        if(this.isListening) 
            this.drawChatWriteMessage(">> "+this.message);
        else
            this.drawChatWriteMessage(">");
        this.getPlugin(PlayerPlugin).enable(!this.isListening);
    }

    offset: Vector = new Vector(40, 800);
    private drawChatWriteMessage(message: string): void 
    {
        this.getPlugin(RendererPlugin).hud.setLabel("chat_write", this.offset, message);
    }
    private drawChatMessages(): void 
    {
        while (this.chatMessages.length >= 5)
            this.chatMessages.shift();
        let len = this.chatMessages.length;
        for(let i = 1; i <= len; i++)
        {
            this.getPlugin(RendererPlugin).hud.setLabel("chat"+i, new Vector(this.offset.x, this.offset.y-i*40), ": "+this.chatMessages[len-i]);
        }
    }

    public sendChatMessage(message: string, self: boolean=true): void {
        if(self){
            this.chatMessageEvent.emit(new ChatEventArgs(message));
            if (message.startsWith("/")){
                this.executeCommand(message);
                return;
            }
        }
        this.chatMessages.push(message);
        this.drawChatMessages();
    }

    private executeCommand(message: string): void {
        if (message.startsWith("/setname")) {
            const newName = message.split(" ")[1];
            if (newName) {
                this.getPlugin(PlayerPlugin).player.name = newName;
                this.sendChatMessage(`Name changed to ${newName}`, false);
            } else {
                this.sendChatMessage("Usage: /setname <newname>", false);
            }
        } else if (message.startsWith("/help")) {
            this.sendChatMessage("Available commands: /setname <newname>", false);
        }
    }
}