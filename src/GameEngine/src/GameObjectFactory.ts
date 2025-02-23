import { Color } from "./Helpers/Color";
import { RigidBodyC } from "./Components/RigidBody";
import { SquareRendererC } from "./Components/Renderers/SquareRenderer";
import { GameObject } from "./GameObject";
import { Vector } from "./Helpers/Vector";
import { CircleRendererC } from "./Components/Renderers/CircleRenderer";
import { TextRendererC } from "./Components/Renderers/TextRenderer";
import { ColliderC as ColliderC } from "./Components/Collider";
import { ColliderRendererC } from "./Components/Renderers/ColliderRenderer";
import { ConfigPlugin } from "./Plugins/Config";
import { TriangleRendererC } from "./Components/Renderers/TriangleRenderer";
import { BarRendererC } from "./Components/Renderers/BarRenderer";
import { HealthC } from "./Components/Health";
import { Component } from "./Component";
import { AnimationC } from "./Components/Animation";
import { GunC } from "./Components/Gun";
import { ImageRendererC } from "./Components/Renderers/ImageRenderer";
import { FollowerC } from "./Components/Follower";
import { PlayerPlugin } from "./Plugins/Player";
import { PolygonRendererC } from "./Components/Renderers/PolygonRenderer";
import { DestroyerC } from "./Components/Destroyer";

export class GameObjectFactory {
    public static squareGO(side: number = 2, ...components: Component[]): GameObject {
        let squareGO: GameObject = new GameObject(
            new RigidBodyC(),
            new SquareRendererC(side, 0, Color.randomColor2().toArgb(0.75)),
            new BarRendererC(0.1),
            new ColliderC(side/2),
            new ColliderRendererC(),
            new HealthC(50),
            new AnimationC(),
            ...components
        );
        squareGO.transform.rotation = Math.random()*2*Math.PI;
        squareGO.name = "Square";
        
        return squareGO;
    }
    public static polygonGO(radius: number = 2, n: number = 3, ...components: Component[]): GameObject {
        let squareGO: GameObject = new GameObject(
            new RigidBodyC(),
            new PolygonRendererC(radius, n, 0, Color.randomColor2().toArgb(0.75)),
            new BarRendererC(0.1),
            new ColliderC(radius),
            new ColliderRendererC(),
            new HealthC(250),
            new AnimationC(),
            ...components
        );
        squareGO.transform.rotation = Math.random()*2*Math.PI;
        squareGO.name = "Square";
        
        return squareGO;
    }
    public static triangleGO(side: number = 2, ...components: Component[]): GameObject {
        let triangleGO: GameObject = new GameObject(
            new RigidBodyC(),
            new TriangleRendererC(side, 0, Color.randomColor2().toArgb(0.75)),
            new BarRendererC(0.1),
            new ColliderC(side/2),
            new ColliderRendererC(),
            new HealthC(75),
            new AnimationC(),
            ...components
        );
        triangleGO.transform.rotation = Math.random()*2*Math.PI;
        triangleGO.name = "Triangle";
      
        return triangleGO;
    }

    public static circleGO(radius: number = 2, text: string="", ...components: Component[]): GameObject {
        let circleGO: GameObject = new GameObject(
            new TextRendererC(text),
            new RigidBodyC(),
            new CircleRendererC(radius),
            new BarRendererC(12),
            new ColliderC(radius, false),
            new ColliderRendererC(),
            new HealthC(500),
            new AnimationC(),
            ...components
        );
        circleGO.transform.rotation = 0;
        circleGO.name = "Circle";
      
        return circleGO;
    }

    public static bulletGO(radius: number = 0.65, lifeTime: number=1, ...components: Component[]): GameObject {
        let bulletGO: GameObject = new GameObject(
            new RigidBodyC(0.0025),
            new CircleRendererC(radius, -0.5, ConfigPlugin.get("bulletColor").clone()),
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
            new CircleRendererC(radius, 5, ConfigPlugin.get("playerColor").clone()),
            // new ImageRendererC(radius*3, new Vector(1.3, 0.3) ,undefined, 5.1, ConfigPlugin.get("playerColor").clone()),
            new TextRendererC("Player", true, 5.5),
            new ColliderRendererC(),
            new BarRendererC(5.5),
            new RigidBodyC(0.025),
            new ColliderC(radius, false),
            new HealthC(1000),
            new AnimationC(),
            new GunC(),
            ...components
        );
        playerGO.transform.rotation = 0;
        playerGO.name = "Player";
        
        return playerGO;
    }


}