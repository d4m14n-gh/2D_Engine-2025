"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StandaloneComponent = void 0;
const Component_1 = require("../Core/Component");
class StandaloneComponent extends Component_1.Component {
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
exports.StandaloneComponent = StandaloneComponent;
