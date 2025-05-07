"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CameraPlugin = void 0;
const Vector_1 = require("../Helpers/Vector");
const Plugin_1 = require("../Core/Plugin");
const Player_1 = require("./Player");
class CameraPlugin extends Plugin_1.Plugin {
    cameraPositon = new Vector_1.Vector(4, 0);
    scale = 20;
    targetScale = 40;
    start() {
        let targetCamera = this.getPlugin(Player_1.PlayerPlugin).getPlayerPosition();
        this.cameraPositon = targetCamera.clone();
    }
    fixedUpdate(delta) {
        let targetCamera = this.getPlugin(Player_1.PlayerPlugin).getPlayerPosition();
        this.scale += (this.targetScale - this.scale) * (2.5 * delta);
        this.cameraPositon = this.cameraPositon.add(targetCamera.sub(this.cameraPositon).times(0.02));
        // this.cameraPositon = targetCamera.clone();
        //  this.cameraPositon.add(targetCamera.sub(this.cameraPositon).times(0.02));
    }
}
exports.CameraPlugin = CameraPlugin;
