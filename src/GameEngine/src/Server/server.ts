import { ClientPlugin } from "../Plugins/Client";
import { CliPlugin } from "../Plugins/CliPlugin";
import { CollisionDetectionPlugin } from "../Plugins/CollisionDetection";
import { ConfigPlugin } from "../Plugins/Config";
import { ConsolePlugin } from "../Plugins/Hud/Console";
import { KeyboardPlugin } from "../Plugins/Keyboard";
import { PhysicsPlugin } from "../Plugins/Physics";
import { PlayerPlugin } from "../Plugins/Player";
import { SchedulerPlugin } from "../Plugins/Scheduler";
import { ServerPlugin } from "../Plugins/Server";
import { StandaloneComponentPlugin } from "../Plugins/StandaloneComponent";
import { ServerWorld } from "../Worlds/ServerWorld";


export async function main () {
  const world: ServerWorld = new ServerWorld(
    new ConfigPlugin(),
    new CliPlugin(),
    new SchedulerPlugin(),
    new PhysicsPlugin(),
    new CollisionDetectionPlugin(),
    new StandaloneComponentPlugin(),
    new ServerPlugin()
  );
  for(let i=0;;i++){
    console.log("Tick: " + i);
    world.tick();
    await new Promise(resolve => setTimeout(resolve, 20));
  }
}
main();