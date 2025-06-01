import { GameAnimation } from "../Helpers/Animation";
import { Vector } from "../Helpers/Vector";
import { GOManagerPlugin } from "../Plugins/GOManager";
import { BarRendererC } from "./Renderers/BarRenderer";
import { RigidBodyC } from "./RigidBody";
import { StandaloneComponent } from "./StandaloneComponent";

export class AnimationC extends StandaloneComponent {
    
    private shrinkAnimation: GameAnimation = new GameAnimation();
    private zoomAnimation: GameAnimation = new GameAnimation();
    private defaultZoom: Vector = new Vector(1, 1);
    
    constructor(){
        super();
        this.shrinkAnimation = new GameAnimation(
            (fill)=>{},//this.getComponent(RigidBodyC).getTransform() .scale = this.defaultZoom.mul(1-fill),
            ()=>{this.getComponent<BarRendererC>(BarRendererC)!.enabled = false},
            ()=>this.getPlugin(GOManagerPlugin)?.destroy(this.gameObject)
        );
        this.zoomAnimation = new GameAnimation(
            (fill)=>{},//this.getTransform().scale = this.defaultZoom.mul(1+Math.sin(Math.PI*fill)/5),
            ()=>this.defaultZoom = Vector.zero(),//this.getTransform().scale.clone(),
            ()=>{}//this.getTransform().scale = this.defaultZoom
        );
    }
    
    override update(delta: number): void {
        this.shrinkAnimation.update(delta);
        this.zoomAnimation.update(delta);
    }
    
    public startZoom(): void{
        this.zoomAnimation.start();
    }
    public startShrink(): void{
        this.shrinkAnimation.start();
    }
} 