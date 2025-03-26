import { Component } from "../../Core/Component";
export class RendererC extends Component {
    zindex;
    constructor(zindex = 0) {
        super();
        this.zindex = zindex;
    }
}
