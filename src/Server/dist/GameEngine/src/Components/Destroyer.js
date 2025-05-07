"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DestroyerC = void 0;
const Component_1 = require("../Core/Component");
const Scheduler_1 = require("../Plugins/Scheduler");
const Animation_1 = require("./Animation");
const Collider_1 = require("./Collider");
class DestroyerC extends Component_1.Component {
    lifeTime;
    constructor(lifeTime = 1) {
        super();
        this.lifeTime = lifeTime;
    }
    onInvoke(topic) {
        this.getComponent(Collider_1.ColliderC)?.enable(false);
        this.getComponent(Animation_1.AnimationC)?.startShrink();
    }
    onSpawn() {
        let destroyTime = this.getGameWorld().getTotal() + this.lifeTime;
        this.getGameWorld().getPlugin(Scheduler_1.SchedulerPlugin).addInvoke(this, destroyTime, "destroy");
    }
}
exports.DestroyerC = DestroyerC;
