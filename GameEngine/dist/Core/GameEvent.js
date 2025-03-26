export class EventArgs {
    constructor() { }
}
export class EventSubsKey {
    event;
    sub;
    constructor(event, sub) {
        this.event = new WeakRef(event);
        this.sub = new WeakRef(sub);
    }
    equals(other) {
        return other !== undefined && this.event.deref() !== undefined && this.sub.deref() !== undefined && this.event.deref() === other.event.deref() && this.sub.deref() === other.sub.deref();
    }
}
export class GameEvent {
    subs = new Set();
    args = [];
    subscribe(sub) {
        this.subs.add(new WeakRef(sub));
        const eventSubKey = new EventSubsKey(this, sub);
        return eventSubKey;
    }
    unsubscribe(sub) {
        this.subs.delete(new WeakRef(sub));
    }
    addInvokeArgs(args) {
        this.args.push(args);
    }
    invoke() {
        for (const sub of this.subs) {
            for (const args of this.args) {
                const derefSub = sub.deref();
                if (derefSub)
                    derefSub.onEvent(new EventSubsKey(this, derefSub), args);
                else
                    this.subs.delete(sub);
            }
        }
        this.args = [];
    }
}
