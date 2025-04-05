import { Vector } from "../Helpers/Vector";
import { Plugin } from "../Core/Plugin";
import { MousePlugin, MouseScrollEventArgs } from "./Mouse";
import { EventArgs } from "../Core/GameEvent";
import { CommandResult, gameCommand } from "../Helpers/Commands";
import { PassThrough } from "stream";

export class CameraPlugin extends Plugin {
    public cameraPositon: Vector = new Vector(4, 0);
    public targetCameraPositon: Vector = new Vector(4, 0);
    public cameraOffset: Vector = new Vector(100, 100);
    
    public scale: Vector = new Vector(20, -20);
    private scaleM: number = 20;
    public targetScale: number = 40;
    public name: string = "camera";

    override start(): void {
        this.getPlugin(MousePlugin).mouseScrollYEvent.subscribe(this, "scroll");
    }
    
    override event(args: EventArgs, alias?: string): void {
        const mouseArgs = args as MouseScrollEventArgs;
        this.zoom(mouseArgs.delta);
    }

    public zoom(delta: number): void {
        delta = Math.sign(delta);
        if (delta > 0 && this.targetScale * 0.9 > 10)
            this.targetScale = 0.9 * this.targetScale;
        if (delta < 0 && this.targetScale * 1.1 < 100)
            this.targetScale = 1.1 * this.targetScale;
    }

    public getWorldPosition(screenPositon: Vector): Vector{
        let scale = this.getPlugin(CameraPlugin).scale;
        let cameraPosition = this.getPlugin(CameraPlugin).cameraPositon;
        let worldPosition = new Vector((screenPositon.x-this.cameraOffset.x)/scale.x, (screenPositon.y-this.cameraOffset.y)/scale.y).add(cameraPosition);
        return worldPosition;
    }

    override fixedUpdate(delta: number): void {
        this.scaleM += (this.targetScale-this.scaleM)*(2.5*delta);
        this.scale = new Vector(this.scaleM, -this.scaleM);
        this.cameraPositon = this.cameraPositon.add(this.targetCameraPositon.sub(this.cameraPositon).times(0.02));
    }

    @gameCommand
    private getscale(): CommandResult{
        return new CommandResult(true, this.scale.toString(), this.scale);
    }
}