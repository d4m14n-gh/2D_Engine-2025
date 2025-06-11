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
    public playerId: string = GameObjectFactory.playerGO().getId();
    
    private playerName: string = "player";
    private activeCanon: number = 0;


    public getPlayerPosition(): Vector | undefined {
      return this.gameWorld.getGameObject(this.playerId)?.getTransform().position.clone();
    }
    public getPlayerColor(): rgb | undefined{
      return this.gameWorld.getGameObject(this.playerId)?.getComponent(PolygonRendererC)?.color.clone();
    }


    public override start(): void {
      this.respawn();
      const playerGO = this.gameWorld.getGameObject(this.playerId)!;
      playerGO.getComponent(PolygonRendererC)!.color = this.getPlugin(ConfigPlugin)?.get("playerColor")??rgb.randomColor2();
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
        else if (keyArgs.key === "q") {
          this.activeCanon = (this.activeCanon + 1) % 2;
        }
      }
    }
    
    // color: rgb = new rgb(53, 110, 58);
    // target: rgb = new rgb(53, 110, 58);


    synchronize(): void {
      // const client = this.getPlugin(ClientPlugin);
      // const mock: GameObject = JSON.parse(JSON.stringify(this.player));
      // delete (mock as any).gameWorld;

      // client.synchronize(this.playerId, mock);
    }

    protected override update(delta: number): void {
      const playerGO = this.gameWorld.getGameObject(this.playerId);
      if (!playerGO) return;
      // this.synchronize();


      let camera = this.getPlugin(CameraPlugin);
      camera.targetCameraPositon = playerGO.getTransform().position.clone();
      if (!playerGO.enabled) return;

      let mouse = this.getPlugin(MousePlugin);
      let keyboard = this.getPlugin(KeyboardPlugin);

      if (keyboard.isPressed("e")||mouse.isKeyDown(0)) {
        const canon = playerGO.getExtraComponent(CanonC, this.activeCanon)!;
        canon.shoot();
      }
      
      for(let canon of playerGO.getAllComponents2(CanonC)) {
        canon.targetDirection = camera.getWorldPosition(mouse.getMouseScreenPosition()).sub(playerGO.getTransform().position);
        canon.range = camera.getWorldPosition(mouse.getMouseScreenPosition()).sub(playerGO.getTransform().position.add(canon.getGlobalOffset())).magnitude();
      }


      const g = -25;
      const a = keyboard.isPressed("shift") ? 120 : 60;

      const vmax = 50.0;
      const rotation = playerGO.getTransform().rotation;
      const direction = Vector.fromRad(rotation);
      const turnSpeed = 2.5;


      let rigidBody = playerGO.getComponent(RigidBodyC)!;
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
    const playerGO = this.gameWorld.getGameObject(this.playerId);
    if (playerGO)
      playerGO.name = newName;
    
    try {
      this.getPlugin(ClientPlugin).setServerName(newName);
    } catch (error) {
      console.error("Error setting server name:", error);
    }
    return new CommandResult(true, `Player name set to ${newName}`, undefined);
  }

  @cli("setcolor", "<color: string | rgb>")
  private setcolor(color: string | rgb): CommandResult {
    const playerGO = this.gameWorld.getGameObject(this.playerId);
    try{
      let newColor = rgb.tryParseCssColor(color.toString());
      if (newColor && playerGO)
        playerGO.getComponent(PolygonRendererC)!.color = newColor;
    } catch {}
    return new CommandResult(true, `Player color set`, undefined);
  }

  @cli("respawn")  
  private respawn(): CommandResult {
    // const playerGO = this.gameWorld.getGameObject(this.playerId);
    // if(playerGO)  
    if(this.gameWorld.hasGameObject(this.playerId))
      this.gameWorld.destroyById(this.playerId);
    const player = GameObjectFactory.playerGO();
    player.name = this.playerName
    player.getComponent(PolygonRendererC)!.color = rgb.randomColor2();
    ;
    this.gameWorld.spawn(player);
    this.playerId = player.getId();
    return new CommandResult(true, `Player respawned`, undefined);
  }

  @cli("getcolor", undefined, "rgb")
  private getcolor(): CommandResult {
    const playerGO = this.gameWorld.getGameObject(this.playerId);
    if (!playerGO) 
      return new CommandResult(false, "Player not found", undefined);
    return new CommandResult(true, `Player color is ${playerGO.getComponent(PolygonRendererC)!.color}`, playerGO  .getComponent(PolygonRendererC)!.color);
  }
}
