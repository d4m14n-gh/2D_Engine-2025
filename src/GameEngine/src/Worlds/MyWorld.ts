import { Component } from "../Component";
import { FollowerC } from "../Components/Follower";
import { RigidBodyC } from "../Components/RigidBody";
import { SquareRendererC } from "../Components/Renderers/SquareRenderer";
import { StandaloneComponent } from "../Components/StandaloneComponent";
import { TriangleRendererC } from "../Components/Renderers/TriangleRenderer";
import { GameObject } from "../GameObject";
import { GameObjectFactory } from "../GameObjectFactory";
import { GameWorld } from "../GameWorld";
import { Vector } from "../Helpers/Vector";
import { CameraPlugin } from "../Plugins/Camera";
import { ConfigPlugin } from "../Plugins/Config";
import { PhysicsPlugin } from "../Plugins/Physics";
import { PlayerPlugin } from "../Plugins/Player";
import { RendererPlugin } from "../Plugins/Renderer";
import { PolygonRendererC } from "../Components/Renderers/PolygonRenderer";
import { GunC } from "../Components/Gun";
import { NpcC } from "../Components/Npc";

export class MyWorld extends GameWorld {
    override Start() {
        console.log("Hello, MyWorld!");
        
        
        const r = 100;
        for(let i = 0; i < 50; i++){
            let sqr = GameObjectFactory.squareGO()
            sqr.transform.position = new Vector(Math.random()*2*r-r, Math.random()*2*r-r);
            sqr.getComponent<SquareRendererC>(SquareRendererC.name).side = Math.random()/2+2;
            sqr.getComponent<RigidBodyC>(RigidBodyC.name).angularVelocity = Math.random()*2-1;
            this.spawn(sqr);
        }
        for(let i = 0; i < 50; i++){
            let triangle = GameObjectFactory.triangleGO()
            const side = 2.5;
            triangle.transform.position = new Vector(Math.random()*2*r-r, Math.random()*2*r-r);
            triangle.getComponent<TriangleRendererC>(TriangleRendererC.name).side = Math.random()/2+side;
            triangle.getComponent<RigidBodyC>(RigidBodyC.name).angularVelocity = Math.random()*2-1;
            this.spawn(triangle);
        }
        for(let i = 0; i < 50; i++){
            let polygon = GameObjectFactory.polygonGO(undefined, Math.round(Math.random()*5)+3);
            const side = 3.5;
            polygon.transform.position = new Vector(Math.random()*2*r-r, Math.random()*2*r-r);
            polygon.getComponent<PolygonRendererC>(PolygonRendererC.name).radius = Math.random()/2+side;
            polygon.getComponent<RigidBodyC>(RigidBodyC.name).angularVelocity = Math.random()*2-1;
            this.spawn(polygon);
        }
        
        
        
        let followerC = new FollowerC(this.getPlugin<PlayerPlugin>(PlayerPlugin.name).player);
        
        let follower = GameObjectFactory.circleGO(3, "Fella", 
            followerC,
            new GunC(),
            new NpcC()
        );


        follower.transform.position = new Vector(10, 10);
        // follower.getComponent<RigidBodyC>(RigidBodyC.name).drag = 0.01;

        
        follower.spawn(this);
        // follower.getAllComponents().forEach(w => console.log(w, w instanceof StandaloneComponent))
    }

    override Update(delta: number, totalDelta: number) {
        
    }
}