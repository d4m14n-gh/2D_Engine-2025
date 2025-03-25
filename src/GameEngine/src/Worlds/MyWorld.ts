import { Component } from "../Core/Component";
import { RigidBodyC } from "../Components/RigidBody";
import { GameObjectFactory } from "../GameObjectFactory";
import { GameWorld } from "../Core/GameWorld";
import { Vector } from "../Helpers/Vector";
import { PlayerPlugin } from "../Plugins/Player";
import { PolygonRendererC } from "../Components/Renderers/PolygonRenderer";
import { CanonC } from "../Components/Canon";
import { NpcC } from "../Components/Npc";
import { GMath } from "../Helpers/Math";
import { CanonRendererC } from "../Components/Renderers/CanonRenderer";
import { ImageRendererC } from "../Components/Renderers/ImageRenderer";
import { RendererPlugin } from "../Plugins/Renderer";

export class MyWorld extends GameWorld {
    override Start() {
        console.log("Hello, MyWorld!");
        
        
        const r = 250;
        for(let i = 0; i < 350; i++){
            const radius = 4+GMath.symRand(0.25);
            let sqr = GameObjectFactory.polygonGO(radius/2, 4)
            sqr.getTransform().position = Vector.randomPos(r);
            sqr.getComponent(RigidBodyC).angularVelocity = Math.random()*2-1;
            this.spawn(sqr);
        }
        for(let i = 0; i < 150; i++){
            const radius = 4+GMath.symRand(0.25);
            let triangle = GameObjectFactory.polygonGO(radius/2, 3)
            triangle.getTransform().position = Vector.randomPos(r);
            triangle.getComponent(RigidBodyC).angularVelocity = Math.random()*2-1;
            this.spawn(triangle);
        }
        for(let i = 0; i < 150; i++){
            const radius = 4+GMath.symRand(0.25);
            let polygon = GameObjectFactory.polygonGO(radius/2, Math.round(Math.random()*3)+5);
            polygon.getTransform().position = Vector.randomPos(r);
            polygon.getComponent(RigidBodyC).angularVelocity = Math.random()*2-1;
            this.spawn(polygon);
        }
        
        for(let i = 0; i < 25; i++){
            const radius = 3+GMath.symRand(0.25);
            let polygon = GameObjectFactory.polygonGO(
                radius/2, 
                Math.round(Math.random()*3)+5,
                new ImageRendererC(Vector.zero(), undefined, undefined, 12)
            );
            polygon.getTransform().position = new Vector(Math.random()*2*r-r, Math.random()*2*r-r);
            polygon.getComponent(RigidBodyC).angularVelocity = Math.random()*2-1;
            polygon.getComponent(PolygonRendererC).enable(false);
            this.spawn(polygon);
        }
        
        
        
        
        for(let i = 0; i < 5; i++){
            let follower = GameObjectFactory.enemyGO(2.5, "Enemy nr."+i, 4,
                new CanonC(),
                new CanonRendererC(4-0.1),
                new NpcC()
            );

            follower.getTransform().position = Vector.randomPos(r);
            follower.spawn(this);
        }
    }

    override Update(delta: number) {
        
    }
}