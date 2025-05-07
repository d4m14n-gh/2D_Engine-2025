"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulletC = void 0;
const Component_1 = require("../Core/Component");
class BulletC extends Component_1.Component {
    owner;
    constructor(owner) {
        super();
        this.owner = new WeakRef(owner);
    }
    getOwner() {
        return this.owner.deref();
    }
}
exports.BulletC = BulletC;
