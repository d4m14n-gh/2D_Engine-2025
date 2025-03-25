import { Component } from "../Core/Component";
import { IInvokable, SchedulerPlugin } from "../Plugins/Scheduler";
import { AnimationC } from "./Animation";

export class DestroyerC extends Component implements IInvokable {
    
    constructor(private lifeTime: number=1){
        super();
    }

    onInvoke(topic: string): void {
        try{
            this.getComponent(AnimationC).startShrink();
        } catch {}
    }

    override onSpawn(): void {
        let destroyTime = this.getGameWorld().getTotal()+this.lifeTime;
        this.getGameWorld().getPlugin(SchedulerPlugin).addInvoke(this, destroyTime, "destroy");    
    }
} 