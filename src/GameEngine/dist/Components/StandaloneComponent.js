import { Component } from "../Core/Component";
export class StandaloneComponent extends Component {
    tickCount = 0;
    tick(delta) {
        if (this.tickCount == 0)
            this.start();
        else
            this.update(delta);
        this.tickCount++;
    }
    start() { }
    ;
    update(delta) { }
    ;
}
