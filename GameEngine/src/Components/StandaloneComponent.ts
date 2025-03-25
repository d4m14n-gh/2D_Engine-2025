import { Component } from "../Component";
import { GameObject } from "../GameObject";

export abstract class StandaloneComponent extends Component {
    public update(delta: number): void {}; 
    public fixedUpdate(delta: number): void {}; 
}