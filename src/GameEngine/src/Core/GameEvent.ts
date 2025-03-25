export class EventArgs{
    constructor(){}    
}

export class EventSubsKey{
    private event: WeakRef<GameEvent>;
    private sub: WeakRef<Subscriber>;
    public constructor(event: GameEvent, sub: Subscriber){
        this.event = new WeakRef(event);
        this.sub = new WeakRef(sub);
    }
    public equals(other: EventSubsKey): boolean{
        return other !== undefined && this.event.deref() !== undefined && this.sub.deref() !== undefined && this.event.deref() === other.event.deref() && this.sub.deref() === other.sub.deref();
    }
}

export interface Subscriber{
    onEvent(key: EventSubsKey, args: EventArgs): void;
}

export class GameEvent{
    private subs: Set<WeakRef<Subscriber>> = new Set();
    private args: Array<EventArgs> = [];

    public subscribe(sub: Subscriber): EventSubsKey{
        this.subs.add(new WeakRef(sub));
        const eventSubKey = new EventSubsKey(this, sub);
        return eventSubKey;

    }
    public unsubscribe(sub: Subscriber){
        this.subs.delete(new WeakRef(sub));
    }

    public addInvokeArgs(args: EventArgs): void{
        this.args.push(args);
    }

    public invoke(): void{
        for (const sub of this.subs){
            for (const args of this.args){
                const derefSub = sub.deref();
                if(derefSub)
                    derefSub.onEvent(new EventSubsKey(this, derefSub), args);
                else
                    this.subs.delete(sub);
            }
        } 
        this.args = [];
    }
}