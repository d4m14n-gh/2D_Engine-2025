var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Vector } from "../Helpers/Vector";
import { Plugin } from "../Core/Plugin";
import { MousePlugin } from "./Mouse";
import { CommandResult, gameCommand } from "../Helpers/Commands";
export class CameraPlugin extends Plugin {
    cameraPositon = new Vector(4, 0);
    targetCameraPositon = new Vector(4, 0);
    cameraOffset = new Vector(100, 100);
    scale = new Vector(20, -20);
    scaleM = 20;
    targetScale = 40;
    name = "camera";
    start() {
        this.getPlugin(MousePlugin).mouseScrollYEvent.subscribe(this, "scroll");
    }
    event(args, alias) {
        const mouseArgs = args;
        this.zoom(mouseArgs.delta);
    }
    zoom(delta) {
        delta = Math.sign(delta);
        if (delta > 0 && this.targetScale * 0.9 > 10)
            this.targetScale = 0.9 * this.targetScale;
        if (delta < 0 && this.targetScale * 1.1 < 100)
            this.targetScale = 1.1 * this.targetScale;
    }
    getWorldPosition(screenPositon) {
        let scale = this.getPlugin(CameraPlugin).scale;
        let cameraPosition = this.getPlugin(CameraPlugin).cameraPositon;
        let worldPosition = new Vector((screenPositon.x - this.cameraOffset.x) / scale.x, (screenPositon.y - this.cameraOffset.y) / scale.y).add(cameraPosition);
        return worldPosition;
    }
    fixedUpdate(delta) {
        this.scaleM += (this.targetScale - this.scaleM) * (2.5 * delta);
        this.scale = new Vector(this.scaleM, -this.scaleM);
        this.cameraPositon = this.cameraPositon.add(this.targetCameraPositon.sub(this.cameraPositon).times(0.02));
    }
    getscale() {
        return new CommandResult(true, this.scale.toString(), this.scale);
    }
}
__decorate([
    gameCommand,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", CommandResult)
], CameraPlugin.prototype, "getscale", null);
