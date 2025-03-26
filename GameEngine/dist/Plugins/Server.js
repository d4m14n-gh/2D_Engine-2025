import { Plugin } from "../Core/Plugin";
import { io } from 'socket.io-client';
export class ServerPlugin extends Plugin {
    start() {
        const socket = io('http://localhost:3000');
        const messageInput = document.getElementById('message');
        const sendButton = document.getElementById('send');
        const message = "siema co tam";
        socket.emit('message', message);
        socket.on('response', (message) => {
            console.log(message);
        });
    }
    update(delta) {
    }
    fixedUpdate(delta) {
    }
    createServer() {
    }
    startup() {
    }
}
