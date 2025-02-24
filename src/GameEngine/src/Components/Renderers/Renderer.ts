import { Component } from "../../Component";

export abstract class RendererC extends Component {
    public zindex: number = 0;

    constructor(zindex=0){
        super();
    }

    public abstract render(context: CanvasRenderingContext2D): void; 
}