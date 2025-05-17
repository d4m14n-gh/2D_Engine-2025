// import { CanonC } from "../Components/Canon";
import { PolygonRendererC } from "../Components/Renderers/PolygonRenderer";
// import { RigidBodyC } from "../Components/RigidBody";
import { GameObject } from "../Core/GameObject";
import { GameObjectFactory } from "../GameObjectFactory";
import { rgb } from "../Helpers/Color";
import { Vector } from "../Helpers/Vector";
import { Plugin } from "../Core/Plugin";
import { KeyboardEventArgs, KeyboardPlugin } from "./Keyboard";
import { MousePlugin } from "./Mouse";
import { ConfigPlugin } from "./Config";
import { cli, cliPlugin, CommandResult } from "../Helpers/Commands";
import { CameraPlugin } from "./Camera";
import { GOManagerPlugin } from "./GOManager";

export class PlayerPlugin extends Plugin {
    public name: string = "PlayerPlugin";
    private playerName: string = "player";
    public player: GameObject = GameObjectFactory.playerGO();

    public getPlayerPosition(): Vector {
        return this.player.getBody()!.getPosition();
    }
    public getPlayerColor(): rgb {
        return this.player.getComponent(PolygonRendererC)!.color.clone();
    }

    public override start(): void {
      this.respawn();  
      this.player.getComponent(PolygonRendererC)!.color = this.getPlugin(ConfigPlugin)?.get("playerColor")??new rgb(53, 110, 58);
      this.getPlugin(KeyboardPlugin)?.KeyDownEvent.subscribe(this, "KeyDownEvent");
    }

    public override event(args: any, alias?: string): void {
      if (alias=== "KeyDownEvent") {
        let keyArgs = args as KeyboardEventArgs;
        if (keyArgs.key === "r") {
          this.respawn();  
        }
        else if (keyArgs.key === "c") {
          let displayColliders = this.getPlugin(ConfigPlugin)?.get("displayColliders")??false;
          if (displayColliders !== undefined) 
            this.getPlugin(ConfigPlugin)?.set("displayColliders", !displayColliders);
        }
      }
    }
    
    // color: rgb = new rgb(53, 110, 58);
    // target: rgb = new rgb(53, 110, 58);



    protected override update(delta: number): void {
      const body = this.player.getBody()!;
      const camera = this.getPlugin(CameraPlugin);
      const mouse = this.getPlugin(MousePlugin);
      const keyboard = this.getPlugin(KeyboardPlugin);
      
      const ra = -25;
      const a = keyboard.isPressed("shift") ? 120 : 60;
      const vmax = 50.0;
      const rotation = body.getRotation();
      const direction = Vector.fromRad(rotation);
      const turnSpeed = 2.5;
    //   const gun = this.player.getComponent(CanonC);
      // if (Math.random() < 0.05){
      //   this.target=rgb.randomColor2();
      //   // this.getPlugin(CliPlugin)?.execute("player:setcolor {randomcolor}");
      // }
      // this.color = this.color.blend(this.target, 0.02);
      // this.player.getComponent(PolygonRendererC).color = this.color;
      camera.targetCameraPosition = body.getPosition(); 
      if (!this.player.enabled) return;
      
    //   if (!gun) return;
    //   gun.targetDirection = camera.getWorldPosition(mouse.getMouseScreenPosition()).sub(this.player.getTransform().position);
    //   gun.range = camera.getWorldPosition(mouse.getMouseScreenPosition()).sub(this.player.getTransform().position.add(gun.getGlobalOffset())).magnitude();
    //   if (keyboard.isPressed("e")||mouse.isKeyDown(0)) 
    //     gun.shoot();

      let velocity = body.getVelocity();
      // Przyspieszanie
      if (keyboard.isPressed("w")) {
        body.setForce(direction.toUnit().mul(a));
        if (keyboard.isPressed("s"))
          body.setForce(direction.toUnit().mul(-ra));
      }
      else if (keyboard.isPressed("s"))
        body.setForce(direction.toUnit().mul(ra));
      else
        body.setForce(Vector.zero());

      velocity = velocity.sub(velocity.perpendicular(direction));

      if (velocity.length() > vmax)
        velocity.setLength(vmax);
      if (keyboard.isPressed("a"))
        body.setAngularVelocity(turnSpeed);
      else if (keyboard.isPressed("d"))
        body.setAngularVelocity(-turnSpeed);
      else
        body.setAngularVelocity(0);
    }

  
  public cliGetName(): string {
      return "player";
  }

//   @cli("setname", "<name: string>")
//   private setname(newName: string): CommandResult {
//       this.playerName = newName;
//       this.player.name = newName;
//       return new CommandResult(true, `Player name set to ${newName}`, undefined);
//   }

//   @cli("setcolor", "<color: string | rgb>")
//   private setcolor(color: string | rgb): CommandResult {
//       try{
//         let newColor = rgb.tryParseCssColor(color.toString());
//         if (newColor)
//           this.player.getComponent(PolygonRendererC).color = newColor;
//       } catch {}
//       return new CommandResult(true, `Player color set`, undefined);
//   }

  @cli("respawn")  
  private respawn(): CommandResult {
    const gom = this.getPlugin(GOManagerPlugin);
    if(this.player && gom.isSpawned(this.player))  
      gom.destroy(this.player);
    this.player = GameObjectFactory.playerGO();
    this.player.name = this.playerName;
    gom.spawn(this.player);
    return new CommandResult(true, `Player respawned`, undefined);
  }

//   @cli("getcolor", undefined, "rgb")
//   private getcolor(): CommandResult {
//     return new CommandResult(true, `Player color is ${this.player.getComponent(PolygonRendererC).color}`, this.player.getComponent(PolygonRendererC).color);
//   }
}
