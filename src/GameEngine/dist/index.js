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
import { ClientPlugin } from "./Plugins/Client";
import { ChatPlugin } from "./Plugins/Chat";
const pressedKeys = new Set();
document.addEventListener("keydown", (event) => {
    pressedKeys.add(event.key.toLowerCase());
});
document.addEventListener("keyup", (event) => {
    pressedKeys.delete(event.key.toLowerCase());
});
export async function main(canvas, chatInput, chat) {
    let plugins = [];
    plugins.push(new ConfigPlugin());
    plugins.push(new ClientPlugin());
    plugins.push(new ChatPlugin(chatInput, chat));
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
    function fixedTick() {
        const delta = 10;
        setInterval(() => world.fixedTick(), delta);
    }
    function tick() {
        requestAnimationFrame(tick);
        world.tick();
    }
    tick();
    fixedTick();
}
main(document.getElementById("gameCanvas"), document.getElementById("chatInput"), document.getElementById("chat"));
