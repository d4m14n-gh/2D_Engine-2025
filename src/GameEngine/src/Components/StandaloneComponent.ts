import { Component } from "../Component";
import { GameObject } from "../GameObject";

export abstract class StandaloneComponent extends Component {
    private tickCount: number = 0;
    private tick(delta: number): void {
        if(this.tickCount == 0)
            this.start();
        else
            this.update(delta);
        this.tickCount ++;
    }
    protected start(): void {}; 
    protected update(delta: number): void {}; 
}