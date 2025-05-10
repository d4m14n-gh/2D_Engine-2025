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
import { Plugin } from "./Core/Plugin";
import { SchedulerPlugin } from "./Plugins/Scheduler";
import { ProfilerPlugin } from "./Plugins/Hud/Profiler";
import { ClientPlugin } from "./Plugins/Client";
// import { ChatPlugin } from "./Plugins/Chat";
import { CliPlugin } from "./Plugins/CliPlugin";
import { ConsolePlugin } from "./Plugins/Hud/Console";


export async function main (canvas: HTMLCanvasElement, chatInput: HTMLInputElement, chat: HTMLDivElement) {
  let plugins: Plugin[] = [];
  plugins.push(new ConfigPlugin());
  plugins.push(new ClientPlugin());
  // plugins.push(new ChatPlugin(chatInput, chat));
  plugins.push(new CliPlugin());
  plugins.push(new KeyboardPlugin());
  plugins.push(new MousePlugin(canvas));
  plugins.push(new SchedulerPlugin());
  plugins.push(new PlayerPlugin());
  plugins.push(new PhysicsPlugin());
  plugins.push(new CameraPlugin());
  plugins.push(new ConsolePlugin());
  plugins.push(new ProfilerPlugin());
  plugins.push(new CollisionDetectionPlugin());
  plugins.push(new StandaloneComponentPlugin());
  plugins.push(new RendererPlugin(canvas.getContext("2d")!));

  let world: MyWorld = new MyWorld(...plugins);

  function tick() {
    world.tick();
    requestAnimationFrame(tick);
  }
  
  tick();
}
main(document.getElementById("gameCanvas") as HTMLCanvasElement, document.getElementById("chatInput") as HTMLInputElement, document.getElementById("chat") as HTMLDivElement);


