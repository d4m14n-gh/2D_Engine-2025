import { Component } from "../Component";
import { GameObject } from "../GameObject";

export class BulletC extends Component {
    private owner: WeakRef<GameObject>;

    constructor(owner: GameObject){
        super();
        this.owner = new WeakRef(owner);
    }

    public getOwner(): GameObject | undefined{
        return this.owner.deref();
    }

} 