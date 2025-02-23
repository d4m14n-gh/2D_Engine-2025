import { Component } from "../Component";
import { WorldComponent } from "../WorldComponent";

export interface IInvokable {
    onInvoke(topic: string): void;
}

type record = {
    totalTime: number;
    subscriber: WeakRef<IInvokable>; 
    topic: string;
}

export class SchedulerPlugin extends WorldComponent {
    private schedule: record[] = [];

    public addInvoke(subscriber: IInvokable, totalTime: number, topic: string){
        let sub = new WeakRef<IInvokable>(subscriber);
        this.schedule.push({totalTime, subscriber: sub, topic});
        this.schedule.sort((a, b)=>b.totalTime-a.totalTime);
    }

    public override update(delta: number, totalDelta: number): void {
        if(this.schedule.length!=0)
        while(this.schedule.length!=0&&this.schedule[this.schedule.length-1].totalTime<=totalDelta){
            let last = this.schedule.pop()!;
            last.subscriber.deref()?.onInvoke(last.topic);
        }
    }
   
}