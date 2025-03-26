import { Component } from "../Core/Component";
export class BulletC extends Component {
    owner;
    constructor(owner) {
        super();
        this.owner = new WeakRef(owner);
    }
    getOwner() {
        return this.owner.deref();
    }
}
