import { Component } from "../Core/Component";
import { StandaloneComponentPlugin } from "../Plugins/StandaloneComponent";

export abstract class StandaloneComponent extends Component {
    private tickCount: number = 0;
    private tick(delta: number): void {
        this.update(delta);
        this.tickCount ++;
    }
    protected start(): void {
        this.tickCount = 0;
        this.getGameWorld()?.getPlugin(StandaloneComponentPlugin)?.addComponent(this);
    }; 
    protected update(delta: number): void {}; 
}