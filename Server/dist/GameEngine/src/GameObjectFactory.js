"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameObjectFactory = void 0;
const Color_1 = require("./Helpers/Color");
const RigidBody_1 = require("./Components/RigidBody");
const GameObject_1 = require("./Core/GameObject");
const TextRenderer_1 = require("./Components/Renderers/TextRenderer");
const Collider_1 = require("./Components/Collider");
const ColliderRenderer_1 = require("./Components/Renderers/ColliderRenderer");
const Config_1 = require("./Plugins/Config");
const BarRenderer_1 = require("./Components/Renderers/BarRenderer");
const Health_1 = require("./Components/Health");
const Animation_1 = require("./Components/Animation");
const Canon_1 = require("./Components/Canon");
const PolygonRenderer_1 = require("./Components/Renderers/PolygonRenderer");
const Destroyer_1 = require("./Components/Destroyer");
const Math_1 = require("./Helpers/Math");
const CanonRenderer_1 = require("./Components/Renderers/CanonRenderer");
const Bullet_1 = require("./Components/Bullet");
const Vector_1 = require("./Helpers/Vector");
const ChasisRenderer_1 = require("./Components/Renderers/ChasisRenderer");
const TracesRenderer_1 = require("./Components/Renderers/TracesRenderer");
class GameObjectFactory {
    static polygonGO(radius = 2, n = 3, ...components) {
        let polygonGO = new GameObject_1.GameObject(new RigidBody_1.RigidBodyC(0.1), new PolygonRenderer_1.PolygonRendererC(radius, n, 0, Color_1.rgb.randomColor2().toArgb(0.75)), new BarRenderer_1.BarRendererC(0.1), new Collider_1.ColliderC(Math_1.GMath.getColliderRadius(n, radius)), new ColliderRenderer_1.ColliderRendererC(), new Health_1.HealthC(15 * n), new Animation_1.AnimationC(), ...components);
        polygonGO.getTransform().rotation = Math.random() * 2 * Math.PI;
        polygonGO.name = "Polygon";
        return polygonGO;
    }
    static enemyGO(radius = 2.5, text = "", zindex = 4, ...components) {
        let circleGO = new GameObject_1.GameObject(new TextRenderer_1.TextRendererC(text, undefined, zindex + 0.1), new PolygonRenderer_1.PolygonRendererC(radius, 8, zindex), new BarRenderer_1.BarRendererC(zindex + 0.1), new ChasisRenderer_1.ChasisRendererC(zindex - 0.2), new ColliderRenderer_1.ColliderRendererC(), new RigidBody_1.RigidBodyC(30, 0.01), new Collider_1.ColliderC(radius, false), new Health_1.HealthC(1500), new Animation_1.AnimationC(), new TracesRenderer_1.TracesRendererC(-21.37), ...components);
        circleGO.getTransform().rotation = Math_1.GMath.symRand(Math.PI);
        circleGO.getComponent(RigidBody_1.RigidBodyC).angularDrag = 1;
        circleGO.getComponent(Canon_1.CanonC).targetDirection = Vector_1.Vector.fromRad(Math_1.GMath.symRand(Math.PI));
        circleGO.name = "Enemy";
        return circleGO;
    }
    static bulletGO(owner, hp = 30, radius = 0.65, lifeTime = 1, zindex = -1, ...components) {
        let bulletGO = new GameObject_1.GameObject(new RigidBody_1.RigidBodyC(0.05, 0.0), new PolygonRenderer_1.PolygonRendererC(radius, 10, zindex, Config_1.ConfigPlugin.get("bulletColor").clone()), new Collider_1.ColliderC(radius, false), new ColliderRenderer_1.ColliderRendererC(), new Health_1.HealthC(hp), new Animation_1.AnimationC(), new Destroyer_1.DestroyerC(lifeTime), new Bullet_1.BulletC(owner), ...components);
        bulletGO.getTransform().rotation = 0;
        bulletGO.name = "Bullet";
        return bulletGO;
    }
    static playerGO(radius = Config_1.ConfigPlugin.get("playerSize") ?? 2.5, zindex = 5, ...components) {
        let playerGO = new GameObject_1.GameObject(
        // new ImageRendererC(undefined, new Vector(1.3, 0.3), "GameEngine/src/Assets/vectorpaint2.svg" , zindex-0.2),
        new ChasisRenderer_1.ChasisRendererC(zindex - 0.2), new PolygonRenderer_1.PolygonRendererC(radius, 10, zindex, Config_1.ConfigPlugin.get("playerColor").clone()), new TextRenderer_1.TextRendererC("Player", true, zindex + 0.1), new ColliderRenderer_1.ColliderRendererC(), new BarRenderer_1.BarRendererC(zindex + 0.1), new CanonRenderer_1.CanonRendererC(zindex - 0.1), new RigidBody_1.RigidBodyC(30, 0.05), new Collider_1.ColliderC(radius, false), new Health_1.HealthC(1000), new Animation_1.AnimationC(), new Canon_1.CanonC(5, 1.75, 44), new TracesRenderer_1.TracesRendererC(-21.37), ...components);
        playerGO.getTransform().rotation = 0;
        playerGO.name = "Player";
        return playerGO;
    }
}
exports.GameObjectFactory = GameObjectFactory;
