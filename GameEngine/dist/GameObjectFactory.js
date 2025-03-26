import { rgb } from "./Helpers/Color";
import { RigidBodyC } from "./Components/RigidBody";
import { GameObject } from "./Core/GameObject";
import { TextRendererC } from "./Components/Renderers/TextRenderer";
import { ColliderC as ColliderC } from "./Components/Collider";
import { ColliderRendererC } from "./Components/Renderers/ColliderRenderer";
import { ConfigPlugin } from "./Plugins/Config";
import { BarRendererC } from "./Components/Renderers/BarRenderer";
import { HealthC } from "./Components/Health";
import { AnimationC } from "./Components/Animation";
import { CanonC } from "./Components/Canon";
import { PolygonRendererC } from "./Components/Renderers/PolygonRenderer";
import { DestroyerC } from "./Components/Destroyer";
import { GMath } from "./Helpers/Math";
import { CanonRendererC } from "./Components/Renderers/CanonRenderer";
import { BulletC } from "./Components/Bullet";
import { Vector } from "./Helpers/Vector";
import { ChasisRendererC } from "./Components/Renderers/ChasisRenderer";
import { TracesRendererC } from "./Components/Renderers/TracesRenderer";
export class GameObjectFactory {
    static polygonGO(radius = 2, n = 3, ...components) {
        let polygonGO = new GameObject(new RigidBodyC(0.1), new PolygonRendererC(radius, n, 0, rgb.randomColor2().toArgb(0.75)), new BarRendererC(0.1), new ColliderC(GMath.getColliderRadius(n, radius)), new ColliderRendererC(), new HealthC(15 * n), new AnimationC(), ...components);
        polygonGO.getTransform().rotation = Math.random() * 2 * Math.PI;
        polygonGO.name = "Polygon";
        return polygonGO;
    }
    static enemyGO(radius = 2.5, text = "", zindex = 4, ...components) {
        let circleGO = new GameObject(new TextRendererC(text, undefined, zindex + 0.1), new PolygonRendererC(radius, 8, zindex), new BarRendererC(zindex + 0.1), new ChasisRendererC(zindex - 0.2), new ColliderRendererC(), new RigidBodyC(30, 0.01), new ColliderC(radius, false), new HealthC(1500), new AnimationC(), new TracesRendererC(-21.37), ...components);
        circleGO.getTransform().rotation = GMath.symRand(Math.PI);
        circleGO.getComponent(RigidBodyC).angularDrag = 1;
        circleGO.getComponent(CanonC).targetDirection = Vector.fromRad(GMath.symRand(Math.PI));
        circleGO.name = "Enemy";
        return circleGO;
    }
    static bulletGO(owner, hp = 30, radius = 0.65, lifeTime = 1, zindex = -1, ...components) {
        let bulletGO = new GameObject(new RigidBodyC(0.05, 0.0), new PolygonRendererC(radius, 10, zindex, ConfigPlugin.get("bulletColor").clone()), new ColliderC(radius, false), new ColliderRendererC(), new HealthC(hp), new AnimationC(), new DestroyerC(lifeTime), new BulletC(owner), ...components);
        bulletGO.getTransform().rotation = 0;
        bulletGO.name = "Bullet";
        return bulletGO;
    }
    static playerGO(radius = ConfigPlugin.get("playerSize") ?? 2.5, zindex = 5, ...components) {
        let playerGO = new GameObject(
        // new ImageRendererC(undefined, new Vector(1.3, 0.3), "GameEngine/src/Assets/vectorpaint2.svg" , zindex-0.2),
        new ChasisRendererC(zindex - 0.2), new PolygonRendererC(radius, 10, zindex, ConfigPlugin.get("playerColor").clone()), new TextRendererC("Player", true, zindex + 0.1), new ColliderRendererC(), new BarRendererC(zindex + 0.1), new CanonRendererC(zindex - 0.1), new RigidBodyC(30, 0.05), new ColliderC(radius, false), new HealthC(1000), new AnimationC(), new CanonC(5, 1.75, 44), new TracesRendererC(-21.37), ...components);
        playerGO.getTransform().rotation = 0;
        playerGO.name = "Player";
        return playerGO;
    }
}
