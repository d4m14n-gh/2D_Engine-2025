import { Plugin } from "../Core/Plugin";
export class SchedulerPlugin extends Plugin {
    schedule = [];
    addInvoke(subscriber, totalTime, topic) {
        let sub = new WeakRef(subscriber);
        this.schedule.push({ totalTime, subscriber: sub, topic });
        this.schedule.sort((a, b) => b.totalTime - a.totalTime);
    }
    update(delta) {
        const totalDelta = this.gameWorld.getTotal();
        if (this.schedule.length != 0)
            while (this.schedule.length != 0 && this.schedule[this.schedule.length - 1].totalTime <= totalDelta) {
                let last = this.schedule.pop();
                last.subscriber.deref()?.onInvoke(last.topic);
            }
    }
}
