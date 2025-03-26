import { GameObject } from "./Core/GameObject";
import { GameWorld } from "./Core/GameWorld";
import { GameObjectFactory } from "./GameObjectFactory";
import { Vector } from "./Helpers/Vector";
import { RigidBodyC } from "./Components/RigidBody";
import { rgb } from "./Helpers/Color";
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
import { ProfilerPlugin } from "./Plugins/Profiler";
import { ClientPlugin } from "./Plugins/Server";
// import http from 'http';
// import { Server as SocketIOServer } from 'socket.io';

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
  // const server = http.createServer((req, res) => {
  //   res.writeHead(200, { 'Content-Type': 'text/plain' });
  //   res.end('w\n');
  // });
  // server.listen(3000, 'localhost', () => {
  //   console.log('Server is running on http://localhost:3000');
  // });



  let plugins: Plugin[] = [];
  plugins.push(new ConfigPlugin());
  plugins.push(new ClientPlugin());
  plugins.push(new KeyboardPlugin(pressedKeys));
  plugins.push(new MousePlugin(canvas));
  plugins.push(new SchedulerPlugin());
  plugins.push(new PlayerPlugin());
  plugins.push(new PhysicsPlugin());
  plugins.push(new CameraPlugin());
  plugins.push(new ProfilerPlugin());
  plugins.push(new CollisionDetectionPlugin());
  plugins.push(new StandaloneComponentPlugin());
  plugins.push(new RendererPlugin(canvas.getContext("2d")!));

  let world: MyWorld = new MyWorld(...plugins);
    
  function x() {
    requestAnimationFrame(x);
    world.tick();
  }

  x();
}
main(document.getElementById("gameCanvas") as HTMLCanvasElement);


