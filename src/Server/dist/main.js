"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerPlugin = void 0;
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
class ServerPlugin {
    io;
    server;
    constructor() {
        this.server = http_1.default.createServer((req, res) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Socket.IO server is running\n');
        });
        this.io = new socket_io_1.Server(this.server, {
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
    }
    onChatMessage(socket, message) {
        console.log('Otrzymano wiadomość: ', message);
        socket.broadcast.emit('chat_message', message);
        socket.emit('response', `Odebrano wiadomość o tresci: ${message}`);
    }
    start() {
        this.server.listen(3000, () => console.log('Serwer działa na porcie 3000'));
        this.io.on('connection', (socket) => {
            socket.data.username = "User_" + Math.floor(Math.random() * 100);
            socket.broadcast.emit('chat_message', socket.data.username + ' has connected to chat!');
            socket.on('chat_message', (data) => this.onChatMessage(socket, data));
            socket.on('disconnect', () => console.log('Połączenie zostało zakończone'));
        });
    }
}
exports.ServerPlugin = ServerPlugin;
const serverPlugin = new ServerPlugin();
serverPlugin.start();
