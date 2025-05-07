"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RendererC = void 0;
const Component_1 = require("../../Core/Component");
class RendererC extends Component_1.Component {
    zindex;
    constructor(zindex = 0) {
        super();
        this.zindex = zindex;
    }
}
exports.RendererC = RendererC;
