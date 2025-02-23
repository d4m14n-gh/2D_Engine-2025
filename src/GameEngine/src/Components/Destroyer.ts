import { Component } from "../Component";
import { GameObject } from "../GameObject";
import { IInvokable, SchedulerPlugin } from "../Plugins/Scheduler";
import { AnimationC } from "./Animation";

export class DestroyerC extends Component implements IInvokable {
    
    constructor(private lifeTime: number=1){
        super();
    }

    onInvoke(topic: string): void {
        try{
            this.gameObject.getComponent<AnimationC>(AnimationC.name).startShrink();
        } catch {}
    }

    override start(): void {
        let destroyTime = this.gameObject.gameWorld.getTotal()+this.lifeTime;
        this.gameObject.gameWorld.getPlugin<SchedulerPlugin>(SchedulerPlugin.name).addInvoke(this, destroyTime, "destroy");    
    }
} 