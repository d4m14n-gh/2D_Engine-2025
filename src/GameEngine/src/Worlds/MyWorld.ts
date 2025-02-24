import { Component } from "../Component";
import { FollowerC } from "../Components/Follower";
import { RigidBodyC } from "../Components/RigidBody";
import { GameObjectFactory } from "../GameObjectFactory";
import { GameWorld } from "../GameWorld";
import { Vector } from "../Helpers/Vector";
import { PlayerPlugin } from "../Plugins/Player";
import { PolygonRendererC } from "../Components/Renderers/PolygonRenderer";
import { CanonC } from "../Components/Canon";
import { NpcC } from "../Components/Npc";
import { GMath } from "../Helpers/Math";
import { CanonRendererC } from "../Components/Renderers/CanonRenderer";

export class MyWorld extends GameWorld {
    override Start() {
        console.log("Hello, MyWorld!");
        
        
        const r = 100;
        for(let i = 0; i < 150; i++){
            const radius = 2.5+GMath.symRand(0.25);
            let sqr = GameObjectFactory.polygonGO(radius/2, 4)
            sqr.transform.position = new Vector(Math.random()*2*r-r, Math.random()*2*r-r);
            sqr.getComponent<RigidBodyC>(RigidBodyC.name).angularVelocity = Math.random()*2-1;
            this.spawn(sqr);
        }
        for(let i = 0; i < 150; i++){
            const radius = 2.5+GMath.symRand(0.25);
            let triangle = GameObjectFactory.polygonGO(radius/2, 3)
            triangle.transform.position = new Vector(Math.random()*2*r-r, Math.random()*2*r-r);
            triangle.getComponent<RigidBodyC>(RigidBodyC.name).angularVelocity = Math.random()*2-1;
            this.spawn(triangle);
        }
        for(let i = 0; i < 150; i++){
            const radius = 3+GMath.symRand(0.25);
            let polygon = GameObjectFactory.polygonGO(radius/2, Math.round(Math.random()*3)+5);
            polygon.transform.position = new Vector(Math.random()*2*r-r, Math.random()*2*r-r);
            polygon.getComponent<RigidBodyC>(RigidBodyC.name).angularVelocity = Math.random()*2-1;
            this.spawn(polygon);
        }
        
        
        
        let followerC = new FollowerC(this.getPlugin<PlayerPlugin>(PlayerPlugin.name).player);
        
        let follower = GameObjectFactory.enemyGO(3, "Fella⚖️", 
            followerC,
            new CanonC(),
            new CanonRendererC(),
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