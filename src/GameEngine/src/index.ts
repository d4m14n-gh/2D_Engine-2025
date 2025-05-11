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
import { SchedulerPlugin } from "./Plugins/Scheduler";
import { ProfilerPlugin } from "./Plugins/Hud/Profiler";
import { ClientPlugin } from "./Plugins/Client";
import { CliPlugin } from "./Plugins/CliPlugin";
import { ConsolePlugin } from "./Plugins/Hud/Console";


export async function main (canvas: HTMLCanvasElement) {
  const world: MyWorld = new MyWorld(
    new ConfigPlugin(),
    new ClientPlugin(),
    new CliPlugin(),
    new KeyboardPlugin(),
    new MousePlugin(canvas),
    new SchedulerPlugin(),
    new PlayerPlugin(),
    new PhysicsPlugin(),
    new CameraPlugin(),
    new ConsolePlugin(),
    new ProfilerPlugin(),
    new CollisionDetectionPlugin(),
    new StandaloneComponentPlugin(),
    new RendererPlugin(canvas.getContext("2d")!),
  );

  console.log(world.getAllPlugins());

  function tick() {
    world.tick();
    requestAnimationFrame(tick);
  }
  
  tick();
}
main(document.getElementById("gameCanvas") as HTMLCanvasElement);


