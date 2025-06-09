import http from 'http';
import { Plugin } from "../Core/Plugin";
import { Server as SocketIOServer, Socket } from 'socket.io';
import { PluginOrder } from '../Core/PluginOrder';
import { v4 as uuidv4 } from 'uuid';
import { GameObject } from '../Core/GameObject';



export class ServerPlugin extends Plugin {
  public readonly order: PluginOrder = PluginOrder.Input;
  private io: SocketIOServer;
  private server: http.Server;
  private names: Map<string, string> = new Map(); 
  private mocks: Map<string, GameObject> = new Map();
  

  constructor() {
    super();
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

  onChatMessage(socket: Socket, author: string, message: string) { 
    console.log('Otrzymano wiadomość od ', author, ': ', message);
    socket.broadcast.emit('chat_message', this.getName(socket), message);
    socket.emit('response', `Odebrano wiadomość o tresci: ${message}`);
  }

  start() {
    console.log('Uruchamianie serwera Socket.IO...');
    this.server.listen(8001, () => console.log('Serwer działa na porcie 8001'));
    this.io.on('connection', (socket) => this.onConnection(socket));
  }

  onConnection(socket: Socket): void {
    // socket.broadcast.emit('chat_message', this.getName(socket), 'connected!');

    socket.on('chat_message', (author: string, data: string) => this.onChatMessage(socket, author, data));
    socket.on('disconnect', () => console.log('Połączenie zostało zakończone'));
    socket.on('set_name', (name: string) => this.setName(socket, name));
    socket.on('synchronize_go', (id: string, data: any) => this.synchronize(socket, id, data));
  }


  setName(socket: Socket, name: string): void {
    this.names.set(socket.id, name);
  }
  getName(socket: Socket): string {
    return this.names.get(socket.id) ?? socket.id;
  }


  synchronize(socket: Socket, id: string, data: any): void {
    console.log(`Synchronizing ${id} with data:`, data);
    // this.mocks.set(id, data);
    socket.broadcast.emit('synchronize_go', id, data);
  }
}