import { Plugin } from "../Core/Plugin";
import { Socket, io } from "socket.io-client";
import { ConsoleEventArgs, ConsolePlugin } from "./Hud/Console";
import { PluginOrder } from "../Core/PluginOrder";
import { cli, CommandResult } from "../Helpers/Commands";
import { GameObject } from "../Core/GameObject";
import { GameObjectFactory } from "../GameObjectFactory";
import { RigidBodyC } from "../Components/RigidBody";
import { Vector } from "../Helpers/Vector";



export class ClientPlugin extends Plugin {
    public readonly order: PluginOrder = PluginOrder.Input;
    
    public name: string = "ClientPlugin";
    private socket!: Socket;

    protected override start(): void {
        this.getPlugin(ConsolePlugin)?.messageEnteredEvent.subscribe(this, "chatMessageEvent");

        this.socket = io('http://localhost:8001', {
            transports: ['websocket'],
            reconnection: true,
            reconnectionDelay: 100,
        });
        this.socket.on('connect', () => this.onConnection());
        this.socket.on('disconnect', (reason: string) => this.onDisconnection(reason));

        //custom
        this.socket.on('chat_message', (author: string, message: string) => this.onChatMessage(author, message));
        this.socket.on('synchronize_go', (id: string, data: GameObject) => this.onSynchronize(id, data));
    }

    protected override event(args: any, alias?: string): void {
        let chatArgs = args as ConsoleEventArgs;
        this.sendChatMessage( chatArgs.message);
    }



    public sendChatMessage(message: string): void {
        this.socket.emit('chat_message', this.socket.id, message);
    }



    private onConnection(): void {
        this.getPlugin(ConsolePlugin).writeLine(`connected!`);
        this.setServerName("unnamed");
    }

    private onDisconnection(reason: string): void {
        this.getPlugin(ConsolePlugin).writeLine(`\x1b[31mDisconnected from server: ${reason}\x1b[0m`);
    }

    private onChatMessage(author: string, message: string): void {
        this.getPlugin(ConsolePlugin).writeLine(`\x1b[32m${author}\x1b[0m: ${message}`);
    }

    @cli("setServerName", "<name: string>")
    public setServerName(name: string): CommandResult {
        this.socket.emit('set_name', name);
        return new CommandResult(true, `Server name set to: ${name}`, name);
    }

    


    //synchronizer
    private mocks: Set<string> = new Set();
    public synchronize(id: string, data: GameObject): void {
        this.mocks.add(id);
        // console.log(`Synchronizing ${id} with data:`, data);
        this.socket.emit('synchronize_go', id, data);
    }

    private onSynchronize(id: string, data: GameObject): void {
        const mock = this.gameWorld.getGameObject(id);
        // delete (newMock as any).components.TracesRendererC;
        
        if (mock) {
            this.deepMerge(mock, data);
        }
        else {
            const newMock = GameObjectFactory.playerGO();
            this.deepMerge(newMock, data);
            this.gameWorld.spawn(newMock);
            newMock.getComponent(RigidBodyC).velocity = Vector.zero();
        }
    }

    deepMerge(target: any, source: any): any {
        for (const key of Object.keys(source)) {
            if (
            source[key] instanceof Object &&
            key in target &&
            target[key] instanceof Object
            ) {
            this.deepMerge(target[key], source[key]);
            } else {
            target[key] = source[key];
            }
        }
        return target;
    }

}

