import { RigidBodyC } from "../Components/RigidBody";
import { Plugin } from "../Core/Plugin";
import { io } from 'socket.io-client';



export class ClientPlugin extends Plugin {
    public name: string = "SlientPlugin";
    // override start(): void {
    //   const socket = io('http://localhost:3000/chat');
      
  
    //   const message = "siema co tam";
    //   socket.emit('message', message);
    //   socket.on('response', (message) => console.log(message));

      
    //   socket.on('message', (message) => {
    //     console.log(message);
    //   });
    
    // }

    override update(delta: number): void {
    }
   
    override fixedUpdate(delta: number): void {
    }

    public createServer(): void {
        
    }
    
    public startup(): void {
       

    }
}