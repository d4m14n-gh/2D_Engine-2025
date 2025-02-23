import { Color } from "../Helpers/Color";
import { Component } from "../Component";

export abstract class RendererC extends Component {
    public color: Color = new Color(42, 142, 55);
    public zindex: number = 0;

    constructor(zindex=0){
        super();
    }

    public abstract render(context: CanvasRenderingContext2D): void; 
}