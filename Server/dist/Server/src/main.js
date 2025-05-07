"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const server = http_1.default.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Socket.IO server is running\n');
});
const io = new socket_io_1.Server(server);
// Obsługuje połączenie z klientem
io.on('connection', (socket) => {
    console.log('Nowe połączenie WebSocket');
    // Wysyłamy wiadomość powitalną do klienta
    socket.emit('message', 'Witaj na serwerze Socket.IO!');
    // Otrzymywanie wiadomości od klienta
    socket.on('message', (data) => {
        console.log(`Otrzymano wiadomość: ${data}`);
    });
    // Obsługuje zamknięcie połączenia
    socket.on('disconnect', () => {
        console.log('Połączenie zostało zakończone');
    });
});
// Serwer nasłuchuje na porcie 3000
server.listen(3000, () => {
    console.log('Serwer działa na porcie 3000');
});
