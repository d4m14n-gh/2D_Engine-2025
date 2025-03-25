import { Vector } from "../Helpers/Vector";
import { Plugin } from "../Plugin";
import { PlayerPlugin } from "./Player";

export class CameraPlugin extends Plugin {
    public cameraPositon: Vector = new Vector(4, 0);
    public scale: number = 20;
    public targetScale: number = 40;

    override start(): void {
        let targetCamera = this.getPlugin(PlayerPlugin).getPlayerPosition();
        this.cameraPositon = targetCamera.clone();
    }
    
    override fixedUpdate(delta: number): void {
        let targetCamera = this.getPlugin(PlayerPlugin).getPlayerPosition();
        
        this.scale += (this.targetScale-this.scale)*(2.5*delta);
        this.cameraPositon = this.cameraPositon.add(targetCamera.sub(this.cameraPositon).times(0.02));
        // this.cameraPositon = targetCamera.clone();
        //  this.cameraPositon.add(targetCamera.sub(this.cameraPositon).times(0.02));
    }
}