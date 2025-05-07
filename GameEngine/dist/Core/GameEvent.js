export class EventArgs {
    constructor() { }
}
export class GameEvent {
    subs = new Map();
    args = [];
    subscribe(sub, alias) {
        this.subs.set(new WeakRef(sub), alias);
    }
    unsubscribe(sub) {
        this.subs.delete(new WeakRef(sub));
    }
    emit(args) {
        this.args.push(args);
    }
    register(gameWorld) {
        gameWorld.registerEvent(this);
    }
    invoke() {
        if (this.args.length == 0)
            return;
        for (const [sub, alias] of this.subs) {
            const derefSub = sub.deref();
            if (!derefSub) {
                this.subs.delete(sub);
                continue;
            }
            for (const args of this.args)
                derefSub.event(args, alias);
        }
        this.args = [];
    }
}
