import { Component } from "../Component";
import { GameObject } from "../GameObject";
import { WorldComponent } from "../WorldComponent";

export abstract class StandaloneComponent extends Component {
    enabled: boolean = true;
    
    public update(delta: number, totalDelta: number): void {}; 
    public fixedUpdate(delta: number, totalDelta: number): void {}; 
}