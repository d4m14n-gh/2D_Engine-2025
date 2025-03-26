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
import { ProfilerPlugin } from "./Plugins/Profiler";
import { ServerPlugin } from "./Plugins/Server";
import http from 'http';
// import { Server as SocketIOServer } from 'socket.io';
const pressedKeys = new Set();
document.addEventListener("keydown", (event) => {
    pressedKeys.add(event.key.toLowerCase());
});
document.addEventListener("keyup", (event) => {
    pressedKeys.delete(event.key.toLowerCase());
});
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
export async function main(canvas) {
    const server = http.createServer((req, res) => {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('w\n');
    });
    server.listen(3000, 'localhost', () => {
        console.log('Server is running on http://localhost:3000');
    });
    let plugins = [];
    plugins.push(new ConfigPlugin());
    plugins.push(new ServerPlugin());
    plugins.push(new KeyboardPlugin(pressedKeys));
    plugins.push(new MousePlugin(canvas));
    plugins.push(new SchedulerPlugin());
    plugins.push(new PlayerPlugin());
    plugins.push(new PhysicsPlugin());
    plugins.push(new CameraPlugin());
    plugins.push(new ProfilerPlugin());
    plugins.push(new CollisionDetectionPlugin());
    plugins.push(new StandaloneComponentPlugin());
    plugins.push(new RendererPlugin(canvas.getContext("2d")));
    let world = new MyWorld(...plugins);
    function x() {
        requestAnimationFrame(x);
        world.tick();
    }
    x();
}
main(document.getElementById("gameCanvas"));
