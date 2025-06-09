import { CanonC } from "../Components/Canon";
import { PolygonRendererC } from "../Components/Renderers/PolygonRenderer";
import { RigidBodyC } from "../Components/RigidBody";
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
import { PluginOrder } from "../Core/PluginOrder";
import { ClientPlugin } from "./Client";

export class PlayerPlugin extends Plugin {
    public readonly order: PluginOrder = PluginOrder.Update;
    public name: string = "PlayerPlugin";
    private playerName: string = "player";
    public player: GameObject = GameObjectFactory.playerGO();

    public getPlayerPosition(): Vector {
        return this.player.getTransform().position.clone();
    }
    public getPlayerColor(): rgb {
        return this.player.getComponent(PolygonRendererC).color.clone();
    }


    public override start(): void {
      this.respawn();  
      this.player.getComponent(PolygonRendererC).color = this.getPlugin(ConfigPlugin)?.get("playerColor")??new rgb(53, 110, 58);
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


    synchronize(): void {
      const client = this.getPlugin(ClientPlugin);
      const mock: GameObject = JSON.parse(JSON.stringify(this.player));
      delete (mock as any).gameWorld;

      client.synchronize(this.player.getId(), mock);
    }

    protected override update(delta: number): void {
      this.synchronize();
      // if (Math.random() < 0.05){
      //   this.target=rgb.randomColor2();
      //   // this.getPlugin(CliPlugin)?.execute("player:setcolor {randomcolor}");
      // }
      // this.color = this.color.blend(this.target, 0.02);
      // this.player.getComponent(PolygonRendererC).color = this.color;

      let camera = this.getPlugin(CameraPlugin);
      camera.targetCameraPositon = this.player.getTransform().position.clone();
      if (!this.player.enabled) return;

      let mouse = this.getPlugin(MousePlugin);
      let keyboard = this.getPlugin(KeyboardPlugin);
      let gun = this.player.getComponent(CanonC);
      if (!gun) 
        return;
      gun.targetDirection = camera.getWorldPosition(mouse.getMouseScreenPosition()).sub(this.player.getTransform().position);
      gun.range = camera.getWorldPosition(mouse.getMouseScreenPosition()).sub(this.player.getTransform().position.add(gun.getGlobalOffset())).magnitude();
      if (keyboard.isPressed("e")||mouse.isKeyDown(0)) 
        gun.shoot();


      const g = -25;
      const a = keyboard.isPressed("shift") ? 120 : 60;

      const vmax = 50.0;
      const rotation = this.player.getTransform().rotation;
      const direction = Vector.fromRad(rotation);
      const turnSpeed = 2.5;


      let rigidBody = this.player.getComponent(RigidBodyC);
      let velocity = rigidBody.velocity;
      // Przyspieszanie
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
    }

  
  public cliGetName(): string {
      return "player";
  }

  @cli("setname", "<name: string>")
  private setname(newName: string): CommandResult {
      this.playerName = newName;
      this.player.name = newName;
      return new CommandResult(true, `Player name set to ${newName}`, undefined);
  }

  @cli("setcolor", "<color: string | rgb>")
  private setcolor(color: string | rgb): CommandResult {
      try{
        let newColor = rgb.tryParseCssColor(color.toString());
        if (newColor)
          this.player.getComponent(PolygonRendererC).color = newColor;
      } catch {}
      return new CommandResult(true, `Player color set`, undefined);
  }

  @cli("respawn")  
  private respawn(): CommandResult {
    if(this.player && this.gameWorld.isSpawned(this.player))  
      this.gameWorld.destroy(this.player);
    this.player = GameObjectFactory.playerGO();
    this.player.name=this.playerName;
    this.player.spawn(this.gameWorld);
    return new CommandResult(true, `Player respawned`, undefined);
  }

  @cli("getcolor", undefined, "rgb")
  private getcolor(): CommandResult {
    return new CommandResult(true, `Player color is ${this.player.getComponent(PolygonRendererC).color}`, this.player.getComponent(PolygonRendererC).color);
  }
}
