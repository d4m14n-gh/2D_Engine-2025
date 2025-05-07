import { Plugin } from "../Core/Plugin";
import { ChatPlugin } from "./Chat";
export class ClientPlugin extends Plugin {
    name = "SlientPlugin";
    socket;
    start() {
        // this.getPlugin(ChatPlugin)?.chatMessageEvent.subscribe(this, "chatMessageEvent");
        // this.socket = io('http://localhost:3000', {});
        // this.socket.on('connect', () => this.onConnection());
        // this.socket.on('disconnect', (reason: string) => this.onDisconnection(reason));
        // this.socket.on('chat_message', (message: string) => this.onChatMessage(message));
    }
    event(args, alias) {
        let chatArgs = args;
        this.sendChatMessage(chatArgs.message);
    }
    onConnection() {
        console.log('Connected to server');
    }
    onDisconnection(reason) {
        console.log(`Disconnected from server: ${reason}`);
    }
    onChatMessage(message) {
        console.log(`Received chat message: ${message}`);
        this.getPlugin(ChatPlugin)?.sendChatMessage(message, false);
    }
    sendChatMessage(message) {
        this.socket.emit('chat_message', message);
    }
}
