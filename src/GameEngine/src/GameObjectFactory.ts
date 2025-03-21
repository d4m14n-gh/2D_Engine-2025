import { rgb } from "./Helpers/Color";
import { RigidBodyC } from "./Components/RigidBody";
import { GameObject } from "./GameObject";
import { TextRendererC } from "./Components/Renderers/TextRenderer";
import { ColliderC as ColliderC } from "./Components/Collider";
import { ColliderRendererC } from "./Components/Renderers/ColliderRenderer";
import { ConfigPlugin } from "./Plugins/Config";
import { BarRendererC } from "./Components/Renderers/BarRenderer";
import { HealthC } from "./Components/Health";
import { Component } from "./Component";
import { AnimationC } from "./Components/Animation";
import { CanonC } from "./Components/Canon";
import { PolygonRendererC } from "./Components/Renderers/PolygonRenderer";
import { DestroyerC } from "./Components/Destroyer";
import { GMath } from "./Helpers/Math";
import { CanonRendererC } from "./Components/Renderers/CanonRenderer";
import { BulletC } from "./Components/Bullet";
import { ImageRendererC } from "./Components/Renderers/ImageRenderer";
import { Vector } from "./Helpers/Vector";
import { ChasisRendererC } from "./Components/Renderers/ChasisRenderer";
import { TracesRendererC } from "./Components/Renderers/TracesRenderer";

export class GameObjectFactory {
    public static polygonGO(radius: number = 2, n: number = 3, ...components: Component[]): GameObject {
        let polygonGO: GameObject = new GameObject(
            new RigidBodyC(0.1),
            new PolygonRendererC(radius, n, 0, rgb.randomColor2().toArgb(0.75)),
            new BarRendererC(0.1),
            new ColliderC(GMath.getColliderRadius(n, radius)),
            new ColliderRendererC(),
            new HealthC(15*n),
            new AnimationC(),
            ...components
        );
        polygonGO.getTransform().rotation = Math.random()*2*Math.PI;
        polygonGO.name = "Polygon";
        
        return polygonGO;
    }
    
    public static enemyGO(radius: number = 2.5, text: string="", zindex = 4, ...components: Component[]): GameObject {
        let circleGO: GameObject = new GameObject(
            new TextRendererC(text, undefined, zindex+0.1),
            new PolygonRendererC(radius, 8, zindex),
            new BarRendererC(zindex+0.1),
            new ChasisRendererC(zindex-0.2),
            new ColliderRendererC(),
            new RigidBodyC(30, 0.01),
            new ColliderC(radius, false),
            new HealthC(1500),
            new AnimationC(),
            new TracesRendererC(-21.37),
            ...components
        );
        circleGO.getTransform().rotation = GMath.symRand(Math.PI);
        circleGO.getComponent(RigidBodyC).angularDrag = 1;
        circleGO.getComponent(CanonC).targetDirection = Vector.fromRad(GMath.symRand(Math.PI));
        circleGO.name = "Enemy";
        
        return circleGO;
    }

    public static bulletGO(owner: GameObject, hp=30, radius: number = 0.65, lifeTime: number=1, zindex=-1, ...components: Component[]): GameObject {
        let bulletGO: GameObject = new GameObject(
            new RigidBodyC(0.05 ,0.0),
            new PolygonRendererC(radius, 10, zindex, ConfigPlugin.get("bulletColor").clone()),
            new ColliderC(radius, false),
            new ColliderRendererC(),
            new HealthC(hp),
            new AnimationC(),
            new DestroyerC(lifeTime),
            new BulletC(owner),
            ...components
        );
        bulletGO.getTransform().rotation = 0;
        bulletGO.name = "Bullet";
        
        return bulletGO;
    }

    public static playerGO(radius: number = ConfigPlugin.get("playerSize")??2.5, zindex = 5, ...components: Component[]): GameObject {
        let playerGO: GameObject = new GameObject(
            // new ImageRendererC(undefined, new Vector(1.3, 0.3), "GameEngine/src/Assets/vectorpaint2.svg" , zindex-0.2),
            new ChasisRendererC(zindex-0.2),
            new PolygonRendererC(radius, 10, zindex, ConfigPlugin.get("playerColor").clone()),
            new TextRendererC("Player", true, zindex+0.1),
            new ColliderRendererC(),
            new BarRendererC(zindex+0.1),
            new CanonRendererC(zindex-0.1),
            new RigidBodyC(30, 0.05),
            new ColliderC(radius, false),
            new HealthC(1000),
            new AnimationC(),
            new CanonC(11, .75, 55),
            new TracesRendererC(-21.37),
            ...components
        );
        playerGO.getTransform().rotation = 0;
        playerGO.name = "Player";
        
        return playerGO;
    }


}