import { Vector } from "../Helpers/Vector";
import { Plugin } from "../Core/Plugin";
import { MouseClickEventArgs, MousePlugin, MouseScrollEventArgs } from "./Mouse";
import { EventArgs } from "../Core/GameEvent";
import { CommandResult, cliPlugin, cli } from "../Helpers/Commands";
import { CollisionDetectionPlugin } from "./CollisionDetection";

@cliPlugin("camera")
export class CameraPlugin extends Plugin {
    public cameraPositon: Vector = new Vector(4, 0);
    public targetCameraPositon: Vector = new Vector(4, 0);
    public cameraScreenOffset: Vector = new Vector(100, 100);
    
    public followingSpeed: number = 0.02;
    public isFollowing: boolean = true;
    public scaleV: Vector = new Vector(20, -20);
    private scale: number = 20;
    private targetId: string = "None"; //todo: delete this
    public targetScale: number = 40;
    public name: string = "CameraPlugin";

    override start(): void {
        this.getPlugin(MousePlugin).mouseScrollYEvent.subscribe(this, "scroll");
        this.getPlugin(MousePlugin).mouseDownEvent.subscribe(this, "down");
        this.getPlugin(MousePlugin).mouseUpEvent.subscribe(this, "up");
    }
    
    override event(args: EventArgs, alias?: string): void {
        if (alias == "scroll") {
            const mouseArgs = args as MouseScrollEventArgs;
            this.zoom(mouseArgs.delta);
        }
        //todo: delete this
        else if (alias == "down") {
            const mouseArgs = args as MouseClickEventArgs;
            if (mouseArgs.button != 1) 
                return;
            const target = this.gameWorld.getGameObject(this.targetId);
            if (target){
                this.targetId = "None";
                return;
            }
            const mousePositonScreen = this.getPlugin(MousePlugin).getMouseScreenPosition();
            const mousePositon = this.getWorldPosition(mousePositonScreen);
            let gameObject = this.getPlugin(CollisionDetectionPlugin).overlapPoint(mousePositon)[0]?.getGameObject();
            if (gameObject)
                this.targetId = gameObject.getId();
        }
        // else if (alias == "up") {
        //     const mouseArgs = args as MouseClickEventArgs;
        //     if (mouseArgs.button != 1) 
        //         return;
        //     this.target = undefined;
        // }


    }

    public zoom(delta: number): void {
        delta = Math.sign(delta);
        if (delta > 0 && this.targetScale * 0.9 > 10)
            this.targetScale = 0.9 * this.targetScale;
        if (delta < 0 && this.targetScale * 1.1 < 100)
            this.targetScale = 1.1 * this.targetScale;
    }

    public getWorldPosition(screenPositon: Vector): Vector{
        let scale = this.getPlugin(CameraPlugin).scaleV;
        let cameraPosition = this.getPlugin(CameraPlugin).cameraPositon;
        let worldPosition = new Vector((screenPositon.x-this.cameraScreenOffset.x)/scale.x, (screenPositon.y-this.cameraScreenOffset.y)/scale.y).add(cameraPosition);
        return worldPosition;
    }


    protected override update(delta: number): void {
        if (this.isFollowing) 
            this.cameraPositon = this.cameraPositon.interpolate(this.targetCameraPositon, Math.pow(this.followingSpeed, delta));


        // this.scale += (this.targetScale-this.scale)*(2.5*delta);
        this.scale += (this.targetScale-this.scale)*(1-Math.pow(0.002, delta));// (this.targetScale-this.scale)*(2.5*delta);
        this.scaleV = new Vector(this.scale, -this.scale);

        //todo: delete this
        const target = this.gameWorld.getGameObject(this.targetId);
        if (target){
            const mousePositonScreen = this.getPlugin(MousePlugin).getMouseScreenPosition();
            const mousePositon = this.getWorldPosition(mousePositonScreen);
            target.getTransform().position = target.getTransform().position.interpolate(mousePositon, Math.pow(0.001, delta));
        }
    }

    @cli("getscale", undefined, "number")
    private getscale(): CommandResult{
        return new CommandResult(true, this.scaleV.toString(), this.scaleV);
    }

    @cli("follow", "<following: boolean>")
    private follow(following: boolean): CommandResult{
        this.isFollowing = following;
        return new CommandResult(true, `Camera is ${following ? "following" : "not following"}`, undefined);
    }
    @cli("zoom", "<zoom: number>")
    private setzoom(zoom: number): CommandResult{
        this.targetScale = zoom;
        return new CommandResult(true, `Camera zoom set to ${zoom}`, undefined);
    }
}


