import { channel } from "diagnostics_channel";
import { GameWorld } from "./GameWorld";

export class EventArgs{
    constructor(){}    
}

export interface Subscriber{}

export class GameEvent{
    private subs: Map<WeakRef<Subscriber>, string|undefined> = new Map();
    private args: Array<EventArgs> = [];

    public subscribe(sub: Subscriber, alias?: string): void{
        this.subs.set(new WeakRef(sub), alias);
    }
    public unsubscribe(sub: Subscriber){
        this.subs.delete(new WeakRef(sub));
    }

    public emit(args: EventArgs): void{
        this.args.push(args);
    }
    public register(gameWorld: GameWorld): void{
        gameWorld.registerEvent(this);
    }

   
    private invoke(): void{
        if (this.args.length == 0)
            return;
        for (const [sub, alias] of this.subs){
            const derefSub = sub.deref();
            if(!derefSub){
                this.subs.delete(sub);
                continue;
            }
            for (const args of this.args)
                (derefSub as any).event(args, alias);
        }
        this.args = [];
    }
}