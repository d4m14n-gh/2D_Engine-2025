import { Component } from "../../Core/Component";

export abstract class RendererC extends Component {
    public zindex: number;

    constructor(zindex=0){
        super();
        this.zindex=zindex;
    }

    public abstract render(context: CanvasRenderingContext2D): void; 
}