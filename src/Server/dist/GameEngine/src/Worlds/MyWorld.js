"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyWorld = void 0;
const RigidBody_1 = require("../Components/RigidBody");
const GameObjectFactory_1 = require("../GameObjectFactory");
const GameWorld_1 = require("../Core/GameWorld");
const Vector_1 = require("../Helpers/Vector");
const PolygonRenderer_1 = require("../Components/Renderers/PolygonRenderer");
const Canon_1 = require("../Components/Canon");
const Npc_1 = require("../Components/Npc");
const Math_1 = require("../Helpers/Math");
const CanonRenderer_1 = require("../Components/Renderers/CanonRenderer");
const ImageRenderer_1 = require("../Components/Renderers/ImageRenderer");
class MyWorld extends GameWorld_1.GameWorld {
    Start() {
        console.log("Hello, MyWorld!");
        const r = 250;
        for (let i = 0; i < 350; i++) {
            const radius = 4 + Math_1.GMath.symRand(0.25);
            let sqr = GameObjectFactory_1.GameObjectFactory.polygonGO(radius / 2, 4);
            sqr.getTransform().position = Vector_1.Vector.randomPos(r);
            sqr.getComponent(RigidBody_1.RigidBodyC).angularVelocity = Math.random() * 2 - 1;
            this.spawn(sqr);
        }
        for (let i = 0; i < 150; i++) {
            const radius = 4 + Math_1.GMath.symRand(0.25);
            let triangle = GameObjectFactory_1.GameObjectFactory.polygonGO(radius / 2, 3);
            triangle.getTransform().position = Vector_1.Vector.randomPos(r);
            triangle.getComponent(RigidBody_1.RigidBodyC).angularVelocity = Math.random() * 2 - 1;
            this.spawn(triangle);
        }
        for (let i = 0; i < 150; i++) {
            const radius = 4 + Math_1.GMath.symRand(0.25);
            let polygon = GameObjectFactory_1.GameObjectFactory.polygonGO(radius / 2, Math.round(Math.random() * 3) + 5);
            polygon.getTransform().position = Vector_1.Vector.randomPos(r);
            polygon.getComponent(RigidBody_1.RigidBodyC).angularVelocity = Math.random() * 2 - 1;
            this.spawn(polygon);
        }
        for (let i = 0; i < 25; i++) {
            const radius = 3 + Math_1.GMath.symRand(0.25);
            let polygon = GameObjectFactory_1.GameObjectFactory.polygonGO(radius / 2, Math.round(Math.random() * 3) + 5, new ImageRenderer_1.ImageRendererC(Vector_1.Vector.zero(), undefined, undefined, 12));
            polygon.getTransform().position = new Vector_1.Vector(Math.random() * 2 * r - r, Math.random() * 2 * r - r);
            polygon.getComponent(RigidBody_1.RigidBodyC).angularVelocity = Math.random() * 2 - 1;
            polygon.getComponent(PolygonRenderer_1.PolygonRendererC).enable(false);
            this.spawn(polygon);
        }
        for (let i = 0; i < 5; i++) {
            let follower = GameObjectFactory_1.GameObjectFactory.enemyGO(2.5, "Enemy nr." + i, 4, new Canon_1.CanonC(), new CanonRenderer_1.CanonRendererC(4 - 0.1), new Npc_1.NpcC());
            follower.getTransform().position = Vector_1.Vector.randomPos(r);
            follower.spawn(this);
        }
    }
    Update(delta) {
    }
}
exports.MyWorld = MyWorld;
