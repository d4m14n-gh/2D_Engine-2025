import { Component } from "../Core/Component";
import { SchedulerPlugin } from "../Plugins/Scheduler";
import { AnimationC } from "./Animation";
export class DestroyerC extends Component {
    lifeTime;
    constructor(lifeTime = 1) {
        super();
        this.lifeTime = lifeTime;
    }
    onInvoke(topic) {
        // this.getComponent(ColliderC)?.enable(false);
        this.getComponent(AnimationC)?.startShrink();
    }
    start() {
        let destroyTime = this.getGameWorld().getWorldTime() + this.lifeTime;
        this.getGameWorld().getPlugin(SchedulerPlugin).addInvoke(this, destroyTime, "destroy");
    }
}
