import { Component } from "../Core/Component";
import { GameObject } from "../Core/GameObject";
import { rgb } from "../Helpers/Color";
import { AnimationC } from "./Animation";
import { ColliderC } from "./Collider";
import { DestroyerC } from "./Destroyer";
import { HealthC } from "./Health";
import { ColliderRendererC } from "./Renderers/ColliderRenderer";
import { PolygonRendererC } from "./Renderers/PolygonRenderer";
import { RigidBodyC } from "./RigidBody";
export class BulletC extends Component {
    owner;
    constructor(owner) {
        super();
        this.owner = new WeakRef(owner);
    }
    getOwner() {
        return this.owner.deref();
    }
    static bulletGO(owner, hp = 30, radius = 0.65, lifeTime = 1, zindex = -1, ...components) {
        let bulletGO = new GameObject(new RigidBodyC(0.05, 0.0), new PolygonRendererC(radius, 10, zindex, new rgb(173, 87, 87)), new ColliderC(radius, false), new ColliderRendererC(), new HealthC(hp), new AnimationC(), new DestroyerC(lifeTime), new BulletC(owner), ...components);
        bulletGO.getTransform().rotation = 0;
        bulletGO.name = "Bullet";
        return bulletGO;
    }
}
