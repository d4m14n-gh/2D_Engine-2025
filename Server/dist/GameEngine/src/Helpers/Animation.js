"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameAnimation = void 0;
class GameAnimation {
    progress = -1;
    duration = 0.25;
    startAnimation = () => { };
    endAnimation = () => { };
    updateAnimation = () => { };
    constructor(update = () => { }, start = () => { }, end = () => { }) {
        this.updateAnimation = update;
        this.startAnimation = start;
        this.endAnimation = end;
    }
    update(delta) {
        if (this.progress > 0) {
            let fill = (this.duration - this.progress) / this.duration;
            this.progress -= delta;
            this.updateAnimation(fill);
        }
        else if (this.progress != -1) {
            this.endAnimation();
            this.progress = -1;
        }
    }
    start() {
        if (this.progress == -1) {
            this.startAnimation();
            this.progress = this.duration;
        }
        else
            this.progress = (this.duration + this.progress) / 2;
    }
}
exports.GameAnimation = GameAnimation;
