import { Color } from "./Helpers/Color";
import { RigidBodyC } from "./Components/RigidBody";
import { GameObject } from "./GameObject";
import { Vector } from "./Helpers/Vector";
import { TextRendererC } from "./Components/Renderers/TextRenderer";
import { ColliderC as ColliderC } from "./Components/Collider";
import { ColliderRendererC } from "./Components/Renderers/ColliderRenderer";
import { ConfigPlugin } from "./Plugins/Config";
import { BarRendererC } from "./Components/Renderers/BarRenderer";
import { HealthC } from "./Components/Health";
import { Component } from "./Component";
import { AnimationC } from "./Components/Animation";
import { CanonC } from "./Components/Canon";
import { ImageRendererC } from "./Components/Renderers/ImageRenderer";
import { FollowerC } from "./Components/Follower";
import { PlayerPlugin } from "./Plugins/Player";
import { PolygonRendererC } from "./Components/Renderers/PolygonRenderer";
import { DestroyerC } from "./Components/Destroyer";
import { GMath } from "./Helpers/Math";
import { CanonRendererC } from "./Components/Renderers/CanonRenderer";

export class GameObjectFactory {
    public static polygonGO(radius: number = 2, n: number = 3, ...components: Component[]): GameObject {
        let polygonGO: GameObject = new GameObject(
            new RigidBodyC(),
            new PolygonRendererC(radius, n, 0, Color.randomColor2().toArgb(0.95)),
            new BarRendererC(0.1),
            new ColliderC(GMath.getColliderRadius(n, radius)),
            new ColliderRendererC(),
            new HealthC(15*n),
            new AnimationC(),
            ...components
        );
        polygonGO.transform.rotation = Math.random()*2*Math.PI;
        polygonGO.name = "Polygon";
        
        return polygonGO;
    }

    public static enemyGO(radius: number = 2, text: string="", ...components: Component[]): GameObject {
        let circleGO: GameObject = new GameObject(
            new TextRendererC(text, undefined, 1.1),
            new RigidBodyC(),
            new PolygonRendererC(radius, 8, 1),
            new BarRendererC(12),
            new ColliderC(radius, false),
            new ColliderRendererC(),
            new HealthC(500),
            new AnimationC(),
            ...components
        );
        circleGO.transform.rotation = 0;
        circleGO.name = "Enemy";
      
        return circleGO;
    }

    public static bulletGO(radius: number = 0.65, lifeTime: number=1, ...components: Component[]): GameObject {
        let bulletGO: GameObject = new GameObject(
            new RigidBodyC(0.0025),
            new PolygonRendererC(radius, 10, -0.5, ConfigPlugin.get("bulletColor").clone()),
            // new BarRendererC(-0.5),
            new ColliderC(radius, false),
            new ColliderRendererC(),
            new HealthC(30),
            new AnimationC(),
            new DestroyerC(lifeTime),
            // new FollowerC(),
            ...components
        );
        bulletGO.transform.rotation = 0;
        bulletGO.name = "Bullet";
        
        return bulletGO;
    }

    public static playerGO(radius: number = ConfigPlugin.get("playerSize"), ...components: Component[]): GameObject {
        let playerGO: GameObject = new GameObject(
            new PolygonRendererC(radius, 10, 5, ConfigPlugin.get("playerColor").clone()),
            // new ImageRendererC(radius*3, new Vector(1.3, 0.3) ,undefined, 5.1, ConfigPlugin.get("playerColor").clone()),
            new TextRendererC("Player", true, 5.5),
            new ColliderRendererC(),
            new BarRendererC(5.5),
            new CanonRendererC(),
            new RigidBodyC(0.025),
            new ColliderC(radius, false),
            new HealthC(1000),
            new AnimationC(),
            new CanonC(),
            ...components
        );
        playerGO.transform.rotation = 0;
        playerGO.name = "Player";
        
        return playerGO;
    }


}