import { CircleRendererC } from "../Components/Renderers/CircleRenderer";
import { ColliderC } from "../Components/Collider";
import { FollowerC } from "../Components/Follower";
import { GunC } from "../Components/Gun";
import { HealthC } from "../Components/Health";
import { RigidBodyC } from "../Components/RigidBody";
import { SquareRendererC } from "../Components/Renderers/SquareRenderer";
import { TextRendererC } from "../Components/Renderers/TextRenderer";
import { GameObject } from "../GameObject";
import { GameObjectFactory } from "../GameObjectFactory";
import { Color } from "../Helpers/Color";
import { Vector } from "../Helpers/Vector";
import { WorldComponent } from "../WorldComponent";
import { CollisionDetectionPlugin } from "./CollisionDetection";
import { ConfigPlugin } from "./Config";
import { KeyboardPlugin } from "./Keyboard";
import { MousePlugin } from "./Mouse";

export class PlayerPlugin extends WorldComponent {
    public player: GameObject = GameObjectFactory.playerGO();
    
    public override start(): void {
        // this.player.transform.scale = new Vector(1, 1);
        this.gameWorld.spawn(this.player);
        // let collider = this.player.getComponent<ColliderC>(ColliderC.name);
        // let myHealth = this.player.getComponent<HealthC>(HealthC.name);
        // collider.onCollision = other => {
        //   myHealth.damage(other.gameObject);
        // };
    }
    public getPlayerPosition(): Vector {
        return this.player.transform.position.clone();
    }

    public override update(delta: number, totalDelta: number): void {
      let collider = this.player.getComponent<ColliderC>(ColliderC.name);
      

      this.player.name = "player: "+this.gameWorld.getPlugin<CollisionDetectionPlugin>(CollisionDetectionPlugin.name)
      .getCellKey(collider.getCenter()).toString();
      
    }
    
    public override fixedUpdate(delta: number, totalDelta: number): void {
        const speed = 18;
        let vmax = 30.0;
        let keyboard = this.gameWorld.getPlugin<KeyboardPlugin>("KeyboardPlugin");
        let mouse = this.gameWorld.getPlugin<MousePlugin>(MousePlugin.name);
        let rigidBody = this.player.getComponent<RigidBodyC>("RigidBodyC");
        let vx = rigidBody.velocity.x;
        let vy = rigidBody.velocity.y;

        if (keyboard.isKeyDown("w")) {
          vy += speed*delta;
          vy = speed;
        }
        if (keyboard.isKeyDown("s")) {
          vy += -speed*delta;
          vy = -speed;
        }
        if (keyboard.isKeyDown("a")) {
          vx += -speed*delta;
          vx = -speed;
        }
        if (keyboard.isKeyDown("d")) {
          vx += speed*delta;
          vx = speed;
        }
        if (keyboard.isKeyDown("r")) {
          try{
            this.gameWorld.destroy(this.player);
          } catch{}
          this.player = GameObjectFactory.playerGO();
          this.player.spawn(this.gameWorld);
        }
        if (keyboard.isKeyDown("e")||mouse.isKeyDown(0)) {
          let gun = this.player.getComponent<GunC>(GunC.name);
          gun.direction = mouse.getWorldPosition().sub(this.player.transform.position);
          this.player.transform.rotation=-gun.direction.toRad();
          gun.shoot();
        }

        let newVelocity = new Vector(vx, vy);
        if(newVelocity.magnitude()>vmax)
            newVelocity = newVelocity.toUnit().times(vmax);
        rigidBody.velocity = newVelocity;
    }
}