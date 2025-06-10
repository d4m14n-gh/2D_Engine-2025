import { Vector } from "../Helpers/Vector";
import { Plugin } from "../Core/Plugin";
import { MouseClickEventArgs, MousePlugin, MouseScrollEventArgs } from "./Mouse";
import { EventArgs } from "../Core/GameEvent";
import { CommandResult, cliPlugin, cli } from "../Helpers/Commands";
import { CollisionDetectionPlugin } from "./CollisionDetection";
import { KeyboardPlugin } from "./Keyboard";
import { PluginOrder } from "../Core/PluginOrder";

@cliPlugin("camera")
export class CameraPlugin extends Plugin {
    public readonly order: PluginOrder = PluginOrder.Physics;
    
    public cameraPosition: Vector = new Vector(4, 0);
    public targetCameraPositon: Vector = new Vector(4, 0);
    public cameraScreenOffset: Vector = new Vector(100, 100);
    
    public followingSpeed: number = 0.02;
    public isFollowing: boolean = true;
    public zoomV: Vector = new Vector(20, -20);
    private zoom: number = 20;
    private targetId: string = "None"; //todo: delete this
    public targetZoom: number = 40;
    public name: string = "CameraPlugin";
    private transformMatrix: DOMMatrix = new DOMMatrix();

    override start(): void {
        this.getPlugin(MousePlugin).mouseScrollYEvent.subscribe(this, "scroll");
        this.getPlugin(MousePlugin).mouseDownEvent.subscribe(this, "down");
        this.getPlugin(MousePlugin).mouseUpEvent.subscribe(this, "up");
    }
    
    override event(args: EventArgs, alias?: string): void {
        if (alias == "scroll") {
            const mouseArgs = args as MouseScrollEventArgs;
            this.updateZoom(mouseArgs.delta);
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

    public updateZoom(delta: number): void {
        delta = Math.sign(delta);
        if (delta > 0 && this.targetZoom * 0.9 > 10)
            this.targetZoom = 0.9 * this.targetZoom;
        if (delta < 0 && this.targetZoom * 1.1 < 100)
            this.targetZoom = 1.1 * this.targetZoom;
    }

    public getWorldPosition(screenPositon: Vector): Vector{
        let scale = this.getPlugin(CameraPlugin).zoomV;
        let cameraPosition = this.getPlugin(CameraPlugin).cameraPosition;
        let worldPosition = new Vector((screenPositon.x-this.cameraScreenOffset.x)/scale.x, (screenPositon.y-this.cameraScreenOffset.y)/scale.y).add(cameraPosition);
        return worldPosition;
    }

    private updateCameraTransform(): void {
        this.transformMatrix = new DOMMatrix()
            .translate(this.cameraScreenOffset.x, this.cameraScreenOffset.y)
            .scale(this.zoomV.x, this.zoomV.y)
            .translate(-this.cameraPosition.x, -this.cameraPosition.y);
    }
    public getCameraTransform(): DOMMatrix {
        return this.transformMatrix;
    }

    protected override update(delta: number): void {
        if (this.isFollowing) 
            this.cameraPosition = this.cameraPosition.interpolate(this.targetCameraPositon, Math.pow(this.followingSpeed, delta));
        
        
        // this.scale += (this.targetScale-this.scale)*(2.5*delta);
        this.zoom += (this.targetZoom-this.zoom)*(1-Math.pow(0.002, delta));// (this.targetScale-this.scale)*(2.5*delta);
        this.zoomV = new Vector(this.zoom, -this.zoom);
        
        //todo: delete this
        const target = this.gameWorld.getGameObject(this.targetId);
        if (target){
            const mousePositonScreen = this.getPlugin(MousePlugin).getMouseScreenPosition();
            const mousePositon = this.getWorldPosition(mousePositonScreen);
            target.getTransform().position = target.getTransform().position.interpolate(mousePositon, Math.pow(0.001, delta));
            if (this.getPlugin(KeyboardPlugin).isPressed("2")){
                target.getTransform().rotation += 0.5*3.14*delta;
            }
            if (this.getPlugin(KeyboardPlugin).isPressed("1")){
                target.getTransform().rotation -= 0.5*3.14*delta;
            }
        }
        

        this.updateCameraTransform();
    }

    @cli("getscale", undefined, "number")
    private getscale(): CommandResult{
        return new CommandResult(true, this.zoomV.toString(), this.zoomV);
    }

    @cli("follow", "<following: boolean>")
    private follow(following: boolean): CommandResult{
        this.isFollowing = following;
        return new CommandResult(true, `Camera is ${following ? "following" : "not following"}`, undefined);
    }
    @cli("zoom", "<zoom: number>")
    private setzoom(zoom: number): CommandResult{
        this.targetZoom = zoom;
        return new CommandResult(true, `Camera zoom set to ${zoom}`, undefined);
    }
}


