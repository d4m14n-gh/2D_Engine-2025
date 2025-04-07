import http from 'http';
import { DefaultEventsMap, Server as SocketIOServer, Socket } from 'socket.io';

















export class ServerPlugin {
  private io: SocketIOServer;
  private server: http.Server;
  

  constructor() {
    this.server = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Socket.IO server is running\n');
    });
    this.io = new SocketIOServer(this.server, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }}
    );
  }

  onChatMessage(socket: Socket, message: string) { 
    console.log('Otrzymano wiadomość: ', message);
    socket.broadcast.emit('chat_message', message);
    socket.emit('response', `Odebrano wiadomość o tresci: ${message}`);
  }

  start() {
    this.server.listen(3000, () => console.log('Serwer działa na porcie 3000'));
    this.io.on('connection', (socket) => {
      socket.data.username = "User_" + Math.floor(Math.random() * 100); 
      socket.broadcast.emit('chat_message', socket.data.username + ' has connected to chat!');
      socket.on('chat_message', (data: string) => this.onChatMessage(socket, data));
      socket.on('disconnect', () => console.log('Połączenie zostało zakończone'));
    });
  }

}



const serverPlugin: ServerPlugin = new ServerPlugin();
serverPlugin.start();











