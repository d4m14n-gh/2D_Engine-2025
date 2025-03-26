import { Vector } from "../Helpers/Vector";
import { Plugin } from "../Core/Plugin";
import { PlayerPlugin } from "./Player";
export class CameraPlugin extends Plugin {
    cameraPositon = new Vector(4, 0);
    scale = 20;
    targetScale = 40;
    start() {
        let targetCamera = this.getPlugin(PlayerPlugin).getPlayerPosition();
        this.cameraPositon = targetCamera.clone();
    }
    fixedUpdate(delta) {
        let targetCamera = this.getPlugin(PlayerPlugin).getPlayerPosition();
        this.scale += (this.targetScale - this.scale) * (2.5 * delta);
        this.cameraPositon = this.cameraPositon.add(targetCamera.sub(this.cameraPositon).times(0.02));
        // this.cameraPositon = targetCamera.clone();
        //  this.cameraPositon.add(targetCamera.sub(this.cameraPositon).times(0.02));
    }
}
