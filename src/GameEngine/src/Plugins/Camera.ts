import { Vector } from "../Helpers/Vector";
import { WorldComponent } from "../WorldComponent";
import { PlayerPlugin } from "./Player";

export class CameraPlugin extends WorldComponent {
    public cameraPositon: Vector = new Vector(4, 0);
    public scale: number = 20;
    public targetScale: number = 40;

    override start(): void {
        let targetCamera = this.gameWorld.getPlugin<PlayerPlugin>(PlayerPlugin.name).getPlayerPosition();
        this.cameraPositon = targetCamera.clone();
    }
    
    override fixedUpdate(delta: number, totalDelta: number): void {
        let targetCamera = this.gameWorld.getPlugin<PlayerPlugin>(PlayerPlugin.name).getPlayerPosition();
        
        this.scale += (this.targetScale-this.scale)*(2.5*delta);
        this.cameraPositon = this.cameraPositon.add(targetCamera.sub(this.cameraPositon).times(0.02));
        // this.cameraPositon = targetCamera.clone();
        //  this.cameraPositon.add(targetCamera.sub(this.cameraPositon).times(0.02));
    }
}