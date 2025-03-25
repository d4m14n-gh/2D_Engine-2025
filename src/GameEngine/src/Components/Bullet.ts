import { Component } from "../Core/Component";
import { GameObject } from "../Core/GameObject";

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