import { Vector } from "../Helpers/Vector";
import { Plugin } from "../Core/Plugin";
import { MousePlugin, MouseScrollEventArgs } from "./Mouse";
import { EventArgs } from "../Core/GameEvent";
import { CommandResult, gameCommand, cli } from "../Helpers/Commands";

@cli("camera")
export class CameraPlugin extends Plugin {
    public cameraPositon: Vector = new Vector(4, 0);
    public targetCameraPositon: Vector = new Vector(4, 0);
    public cameraScreenOffset: Vector = new Vector(100, 100);
    
    public followingSpeed: number = 2;
    public isFollowing: boolean = true;
    public scale: Vector = new Vector(20, -20);
    private scaleM: number = 20;
    public targetScale: number = 40;
    public name: string = "CameraPlugin";

    override start(): void {
        this.getPlugin(MousePlugin).mouseScrollYEvent.subscribe(this, "scroll");
    }
    
    override event(args: EventArgs, alias?: string): void {
        const mouseArgs = args as MouseScrollEventArgs;
        this.setZoom(mouseArgs.delta);
    }

    public setZoom(delta: number): void {
        delta = Math.sign(delta);
        if (delta > 0 && this.targetScale * 0.9 > 10)
            this.targetScale = 0.9 * this.targetScale;
        if (delta < 0 && this.targetScale * 1.1 < 100)
            this.targetScale = 1.1 * this.targetScale;
    }

    public getWorldPosition(screenPositon: Vector): Vector{
        let scale = this.getPlugin(CameraPlugin).scale;
        let cameraPosition = this.getPlugin(CameraPlugin).cameraPositon;
        let worldPosition = new Vector((screenPositon.x-this.cameraScreenOffset.x)/scale.x, (screenPositon.y-this.cameraScreenOffset.y)/scale.y).add(cameraPosition);
        return worldPosition;
    }

    protected override update(delta: number): void {
        if (this.isFollowing) {
            this.cameraPositon = this.cameraPositon.add(
                this.targetCameraPositon.sub(this.cameraPositon).times(this.followingSpeed * delta)
            );
        }
        this.scaleM += (this.targetScale-this.scaleM)*(2.5*delta);
        this.scale = new Vector(this.scaleM, -this.scaleM);
    }
    override fixedUpdate(delta: number): void {
        this.cameraPositon = this.cameraPositon.add(this.targetCameraPositon.sub(this.cameraPositon).times(0.02));
    }

    @gameCommand
    private getscale(): CommandResult{
        return new CommandResult(true, this.scale.toString(), this.scale);
    }

    @gameCommand
    private follow(following: boolean): CommandResult{
        this.isFollowing = following;
        return new CommandResult(true, `Camera is ${following ? "following" : "not following"}`, undefined);
    }
    @gameCommand
    private zoom(zoom: number): CommandResult{
        this.targetScale = zoom;
        return new CommandResult(true, `Camera zoom set to ${zoom}`, undefined);
    }
}


