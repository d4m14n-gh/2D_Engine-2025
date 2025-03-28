import { CanonC } from "../Components/Canon";
import { PolygonRendererC } from "../Components/Renderers/PolygonRenderer";
import { RigidBodyC as RigidBodyC } from "../Components/RigidBody";
import { GameObject } from "../Core/GameObject";
import { GameObjectFactory } from "../GameObjectFactory";
import { rgb } from "../Helpers/Color";
import { Vector } from "../Helpers/Vector";
import { Plugin } from "../Core/Plugin";
import { KeyboardEventArgs, KeyboardPlugin } from "./Keyboard";
import { MousePlugin } from "./Mouse";
import { ConfigPlugin } from "./Config";

export class PlayerPlugin extends Plugin {
    public name: string = "PlayerPlugin";
    public player: GameObject = GameObjectFactory.playerGO();
    
    public getPlayerPosition(): Vector {
        return this.player.getTransform().position.clone();
    }
    public getPlayerColor(): rgb {
        return this.player.getComponent(PolygonRendererC).color.clone();
    }


    public override start(): void {
        this.player.spawn(this.gameWorld);
        this.player.name="player";
        this.player.getComponent(PolygonRendererC).color = this.getPlugin(ConfigPlugin)?.get("playerColor")??new rgb(53, 110, 58);
        this.getPlugin(KeyboardPlugin).KeyDownEvent.subscribe(this, "KeyDownEvent");
    }

    public override event(args: any, alias?: string): void {
      let keyArgs = args as KeyboardEventArgs;
      if (keyArgs.key === "r") {
        if(this.player && this.gameWorld.isSpawned(this.player))  
          this.gameWorld.destroy(this.player);
        this.player = GameObjectFactory.playerGO();
        this.player.spawn(this.gameWorld);
      }
      else if (keyArgs.key === "c") {
        let displayColliders = this.getPlugin(ConfigPlugin)?.get("displayColliders")??false;
        if (displayColliders !== undefined) 
          this.getPlugin(ConfigPlugin)?.set("displayColliders", !displayColliders);
      }
    }
    
    protected override update(delta: number): void {
      if (!this.player.enabled) 
        return;
      let mouse = this.getPlugin(MousePlugin);
      let keyboard = this.getPlugin(KeyboardPlugin);
      let gun = this.player.getComponent(CanonC);
      


      gun.targetDirection = mouse.getWorldPosition().sub(this.player.getTransform().position);
      gun.range = mouse.getWorldPosition().sub(this.player.getTransform().position.add(gun.getGlobalOffset())).magnitude();
      if (keyboard.isPressed("e")||mouse.isKeyDown(0)) 
        gun.shoot();
    }

    override fixedUpdate(delta: number): void {
      if (!this.player.enabled) 
        return;
      let a = 150;
      const g = -55;
      const vmax = 50.0;
      
      const keyboard = this.getPlugin(KeyboardPlugin);
      const rotation = this.player.getTransform().rotation;
      const direction = Vector.fromRad(rotation);
      
      const turnSpeed = 2.5;
      let rigidBody = this.player.getComponent(RigidBodyC);
      let velocity = rigidBody.velocity;
      // Przyspieszanie
      if (keyboard.isPressed("shift")) 
        a = 250;
      if (keyboard.isPressed("w")) {
        rigidBody.acceleration = direction.toUnit().times(a);
        if (keyboard.isPressed("s"))
          rigidBody.acceleration = direction.toUnit().times(-g);
      }
      else if (keyboard.isPressed("s"))
        rigidBody.acceleration = direction.toUnit().times(g);
      else
        rigidBody.acceleration = Vector.zero();

      velocity = velocity.sub(velocity.perpendicular(direction));

      if (velocity.magnitude() > vmax)
        velocity.setLength(vmax);
      if (keyboard.isPressed("a"))
        rigidBody.angularVelocity = turnSpeed;
      else if (keyboard.isPressed("d"))
        rigidBody.angularVelocity = -turnSpeed;
      else 
        rigidBody.angularVelocity = 0;
    }}
//     public override fixedUpdate(delta: number): void {
//         const speed = 18;
//         let vmax = 30.0;
//         let keyboard = this.getPlugin(KeyboardPlugin);
//         let rigidBody = this.player.getComponent(RigidBodyC);
//         let vx = rigidBody.velocity.x;
//         let vy = rigidBody.velocity.y;

//         if (keyboard.isKeyDown("w")) {
//           vy += speed*delta;
//           vy = speed;
//         }
//         if (keyboard.isKeyDown("s")) {
//           vy += -speed*delta;
//           vy = -speed;
//         }
//         if (keyboard.isKeyDown("a")) {
//           vx += -speed*delta;
//           vx = -speed;
//         }
//         if (keyboard.isKeyDown("d")) {
//           vx += speed*delta;
//           vx = speed;
//         }


//         let newVelocity = new Vector(vx, vy);
//         if(newVelocity.magnitude()>vmax)
//             newVelocity = newVelocity.toUnit().times(vmax);
//         rigidBody.velocity = newVelocity;
//         if (newVelocity.magnitude()!=0)
//           this.player.getTransform().rotation = newVelocity.toRad();
//     }
// }