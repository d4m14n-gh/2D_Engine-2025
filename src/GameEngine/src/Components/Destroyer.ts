import { Component } from "../Core/Component";
import { IInvokable, SchedulerPlugin } from "../Plugins/Scheduler";
import { AnimationC } from "./Animation";

export class DestroyerC extends Component implements IInvokable {
    
    constructor(private lifeTime: number=1){
        super();
    }

    onInvoke(topic: string): void {
        // this.getComponent(ColliderC)?.enable(false);
        this.getComponent(AnimationC)?.startShrink();
    }

    override start(): void {
        let destroyTime = this.getGameWorld()!.getWorldTime()+this.lifeTime;
        this.getGameWorld()!.getPlugin(SchedulerPlugin).addInvoke(this, destroyTime, "destroy");    
    }
} 