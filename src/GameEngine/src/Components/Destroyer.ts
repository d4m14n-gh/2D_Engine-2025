import { Component } from "../Core/Component";
import { IInvokable, SchedulerPlugin } from "../Plugins/Scheduler";
import { AnimationC } from "./Animation";

export class DestroyerC extends Component implements IInvokable {
    
    constructor(private lifeTime: number=1){
        super();
    }

    onInvoke(topic: string): void {
        this.getComponent(AnimationC)?.startShrink();
    }

    override start(): void {
        const world = this.getGameWorld()!;

        let destroyTime = world.getWorldTime()+this.lifeTime;
        world.getPlugin(SchedulerPlugin).addInvoke(this, destroyTime, "destroy");
    }
} 