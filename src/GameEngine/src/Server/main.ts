import { GameWorld } from "../Core/GameWorld";
import { CliPlugin } from "../Plugins/CliPlugin";
import { CollisionDetectionPlugin } from "../Plugins/CollisionDetection";
import { ConfigPlugin } from "../Plugins/Config";
import { PhysicsPlugin } from "../Plugins/Physics";
import { SchedulerPlugin } from "../Plugins/Scheduler";
import { ServerPlugin } from "../Plugins/Server";
import { StandaloneComponentPlugin } from "../Plugins/StandaloneComponent";


let lastTickTime: number = 0;

async function waitPrecise(ms: number, ltt: number) {
  while (performance.now() - ltt < ms) {
  }
}

export async function main () {
  const world: GameWorld = new GameWorld(
    new ConfigPlugin(),
    new CliPlugin(),
    new SchedulerPlugin(),
    new PhysicsPlugin(),
    new CollisionDetectionPlugin(),
    new StandaloneComponentPlugin(),
    new ServerPlugin()
  );
  
  

  for(let i=0;;i++){
    lastTickTime = performance.now();
    if(i%500==0)
      console.log("Tick: " + i + " at " + performance.now().toFixed(2) + "ms");
    await new Promise(resolve => setTimeout(resolve, 0)); 
    world.tick();    
    await waitPrecise(20, lastTickTime); 
  }
}

main();