import { CanonC } from "../Components/Canon";
import { PolygonRendererC } from "../Components/Renderers/PolygonRenderer";
import { RigidBodyC as RigidBodyC } from "../Components/RigidBody";
import { GameObjectFactory } from "../GameObjectFactory";
import { Vector } from "../Helpers/Vector";
import { Plugin } from "../Core/Plugin";
import { KeyboardPlugin } from "./Keyboard";
import { MousePlugin } from "./Mouse";
export class PlayerPlugin extends Plugin {
    player = GameObjectFactory.playerGO();
    start() {
        this.player.spawn(this.gameWorld);
        this.player.name = "player";
    }
    getPlayerPosition() {
        return this.player.getTransform().position.clone();
    }
    getPlayerColor() {
        return this.player.getComponent(PolygonRendererC).color.clone();
    }
    update(delta) {
        let mouse = this.getPlugin(MousePlugin);
        let keyboard = this.getPlugin(KeyboardPlugin);
        let gun = this.player.getComponent(CanonC);
        if (keyboard.isKeyDown("r")) {
            try {
                this.gameWorld.destroy(this.player);
            }
            catch { }
            this.player = GameObjectFactory.playerGO();
            this.player.spawn(this.gameWorld);
        }
        if (!this.player.enabled)
            return;
        gun.targetDirection = mouse.getWorldPosition().sub(this.player.getTransform().position);
        gun.range = mouse.getWorldPosition().sub(this.player.getTransform().position.add(gun.getGlobalOffset())).magnitude();
        if (keyboard.isKeyDown("e") || mouse.isKeyDown(0))
            gun.shoot();
    }
    fixedUpdate(delta) {
        if (!this.player.enabled)
            return;
        let a = 150;
        const g = -55;
        const vmax = 50.0;
        const keyboard = this.getPlugin(KeyboardPlugin);
        const rotation = this.player.getTransform().rotation;
        const direction = Vector.fromRad(rotation);
        const turnSpeed = 2.5;
        let rigidBody = this.player.getComponent(RigidBodyC);
        let velocity = rigidBody.velocity;
        // Przyspieszanie
        if (keyboard.isKeyDown("shift"))
            a = 250;
        if (keyboard.isKeyDown("w")) {
            rigidBody.acceleration = direction.toUnit().times(a);
            if (keyboard.isKeyDown("s"))
                rigidBody.acceleration = direction.toUnit().times(-g);
        }
        else if (keyboard.isKeyDown("s"))
            rigidBody.acceleration = direction.toUnit().times(g);
        else
            rigidBody.acceleration = Vector.zero();
        velocity = velocity.sub(velocity.perpendicular(direction));
        if (velocity.magnitude() > vmax)
            velocity.setLength(vmax);
        if (keyboard.isKeyDown("a"))
            rigidBody.angularVelocity = turnSpeed;
        else if (keyboard.isKeyDown("d"))
            rigidBody.angularVelocity = -turnSpeed;
        else
            rigidBody.angularVelocity = 0;
    }
}
//     public override fixedUpdate(delta: number): void {
//         const speed = 18;
//         let vmax = 30.0;
//         let keyboard = this.getPlugin(KeyboardPlugin);
//         let rigidBody = this.player.getComponent(RigidBodyC);
//         let vx = rigidBody.velocity.x;
//         let vy = rigidBody.velocity.y;
//         if (keyboard.isKeyDown("w")) {
//           vy += speed*delta;
//           vy = speed;
//         }
//         if (keyboard.isKeyDown("s")) {
//           vy += -speed*delta;
//           vy = -speed;
//         }
//         if (keyboard.isKeyDown("a")) {
//           vx += -speed*delta;
//           vx = -speed;
//         }
//         if (keyboard.isKeyDown("d")) {
//           vx += speed*delta;
//           vx = speed;
//         }
//         let newVelocity = new Vector(vx, vy);
//         if(newVelocity.magnitude()>vmax)
//             newVelocity = newVelocity.toUnit().times(vmax);
//         rigidBody.velocity = newVelocity;
//         if (newVelocity.magnitude()!=0)
//           this.player.getTransform().rotation = newVelocity.toRad();
//     }
// }
