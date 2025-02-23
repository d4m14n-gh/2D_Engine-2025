import { GameObject } from "./GameObject";
import { GameWorld } from "./GameWorld";
import { SquareRendererC } from "./Components/Renderers/SquareRenderer";
import { GameObjectFactory } from "./GameObjectFactory";
import { Vector } from "./Helpers/Vector";
import { RigidBodyC } from "./Components/RigidBody";
import { Color } from "./Helpers/Color";
import { MyWorld } from "./Worlds/MyWorld";
import { RendererPlugin } from "./Plugins/Renderer";
import { PhysicsPlugin } from "./Plugins/Physics";
import { KeyboardPlugin } from "./Plugins/Keyboard";
import { MousePlugin } from "./Plugins/Mouse";
import { PlayerPlugin } from "./Plugins/Player";
import { CameraPlugin } from "./Plugins/Camera";
import { ConfigPlugin } from "./Plugins/Config";
import { CollisionDetectionPlugin } from "./Plugins/CollisionDetection";
import { StandaloneComponentPlugin } from "./Plugins/StandaloneComponent";
import { WorldComponent } from "./WorldComponent";
import { SchedulerPlugin } from "./Plugins/Scheduler";

const pressedKeys = new Set<string>();

document.addEventListener("keydown", (event) => {
  pressedKeys.add(event.key.toLowerCase());
});

document.addEventListener("keyup", (event) => {
  pressedKeys.delete(event.key.toLowerCase());
});

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function main (canvas: HTMLCanvasElement) {

  let plugins: WorldComponent[] = [];
  plugins.push(new ConfigPlugin());
  plugins.push(new KeyboardPlugin(pressedKeys));
  plugins.push(new MousePlugin(canvas));
  plugins.push(new SchedulerPlugin());
  plugins.push(new PlayerPlugin());
  plugins.push(new PhysicsPlugin());
  plugins.push(new CameraPlugin());
  plugins.push(new CollisionDetectionPlugin());
  plugins.push(new StandaloneComponentPlugin());
  plugins.push(new RendererPlugin(canvas.getContext("2d")!));

  let world: MyWorld = new MyWorld(...plugins);
    

  for (;;){
      world.nextLoop();
      await sleep(1);
  }
}

main(document.getElementById("gameCanvas") as HTMLCanvasElement);


