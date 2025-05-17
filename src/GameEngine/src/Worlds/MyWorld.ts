// import { RigidBodyC } from "../Components/RigidBody";
import { GameObjectFactory } from "../GameObjectFactory";
import { GameWorld } from "../Core/GameWorld";
import { Vector } from "../Helpers/Vector";
// import { CanonC } from "../Components/Canon";
// import { NpcC } from "../Components/Npc";
import { GMath } from "../Helpers/Math";
import { GOManagerPlugin } from "../Plugins/GOManager";
// import { CanonRendererC } from "../Components/Renderers/CanonRenderer";

export class MyWorld extends GameWorld {
    override Start() {
        console.log("Hello, MyWorld!");
        
        
        const r = 350;
        for(let i = 0; i < 550; i++){
            const radius = 3+GMath.symRand(0.25);
            let sqr = GameObjectFactory.polygonGO(radius/2, 4)
            sqr.getBody()!.setPosition(Vector.randomPos(r));
            sqr.getBody()!.setAngularVelocity(Math.random()*2-1);
            this.getPlugin(GOManagerPlugin).spawn(sqr);
        }
        for(let i = 0; i < 250; i++){
            const radius = 3.5+GMath.symRand(0.25);
            let triangle = GameObjectFactory.polygonGO(radius/2, 3)
            triangle.getBody()!.setPosition(Vector.randomPos(r));
            triangle.getBody()!.setAngularVelocity(Math.random()*2-1);
            this.getPlugin(GOManagerPlugin).spawn(triangle);
        }
        for(let i = 0; i < 350; i++){
            const radius = 4+GMath.symRand(0.25);
            let polygon = GameObjectFactory.polygonGO(radius/2, Math.round(Math.random()*3)+5);
            polygon.getBody()!.setPosition(Vector.randomPos(r));
            polygon.getBody()!.setAngularVelocity(Math.random()*2-1);
            this.getPlugin(GOManagerPlugin).spawn(polygon);
        }
        // for(let i = 0; i < 225; i++){
        //     const radius = 3+GMath.symRand(0.25);
        //     let polygon = GameObjectFactory.polygonGO(
        //         radius/2, 
        //         Math.round(Math.random()*3)+5,
        //         new ImageRendererC(Vector.zero(), undefined, undefined, 12)
        //     );
        //     polygon.getTransform().position = new Vector(Math.random()*2*r-r, Math.random()*2*r-r);
        //     polygon.getComponent(RigidBodyC).angularVelocity = Math.random()*2-1;
        //     polygon.getComponent(PolygonRendererC).enable(false);
        //     this.spawn(polygon);
        // }
        
        
        
        
        // for(let i = 0; i < 25; i++){
        //     let follower = GameObjectFactory.enemyGO(2.5, "Enemy nr."+i, 4,
        //         new CanonC(undefined, undefined, 10+Math.random()*5),
        //         new CanonRendererC(4-0.1),
        //         new NpcC()
        //     );

        //     follower.getTransform().position = Vector.randomPos(r);
        //     follower.spawn(this);
        // }
    }

    override Update(delta: number) {
        
    }
}