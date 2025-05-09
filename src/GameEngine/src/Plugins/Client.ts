import { Plugin } from "../Core/Plugin";
import { Socket, io } from "socket.io-client";
import { ConsoleEventArgs } from "./Hud/Console";
// import { ChatEventArgs, ChatPlugin } from "./Chat";



export class ClientPlugin extends Plugin {
    public name: string = "ClientPlugin";
    private socket!: Socket;

    protected override start(): void {
        // this.getPlugin(ChatPlugin)?.chatMessageEvent.subscribe(this, "chatMessageEvent");

        // this.socket = io('http://localhost:3000', {});
        // this.socket.on('connect', () => this.onConnection());
        // this.socket.on('disconnect', (reason: string) => this.onDisconnection(reason));
        // this.socket.on('chat_message', (message: string) => this.onChatMessage(message));
    }

    protected override event(args: any, alias?: string): void {
        let chatArgs = args as ConsoleEventArgs;
        this.sendChatMessage(chatArgs.message);
    }

    private onConnection(): void {
        console.log('Connected to server');
    }

    private onDisconnection(reason: string): void {
        console.log(`Disconnected from server: ${reason}`);
    }

    private onChatMessage(message: string): void {
        console.log(`Received chat message: ${message}`);
        // this.getPlugin(ChatPlugin)?.sendChatMessage(message, false);
    }
  
    public sendChatMessage(message: string): void {
        this.socket.emit('chat_message', message);
    }
}