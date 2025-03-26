import { GameAnimation } from "../Helpers/Animation";
import { Vector } from "../Helpers/Vector";
import { BarRendererC } from "./Renderers/BarRenderer";
import { StandaloneComponent } from "./StandaloneComponent";
export class AnimationC extends StandaloneComponent {
    shrinkAnimation = new GameAnimation();
    zoomAnimation = new GameAnimation();
    defaultZoom = new Vector(1, 1);
    constructor() {
        super();
        this.shrinkAnimation = new GameAnimation((fill) => this.getTransform().scale = this.defaultZoom.times(1 - fill), () => this.getComponent(BarRendererC)?.enable(false), () => this.getGameObject().destroy());
        this.zoomAnimation = new GameAnimation((fill) => this.getTransform().scale = this.defaultZoom.times(1 + Math.sin(Math.PI * fill) / 5), () => this.defaultZoom = this.getTransform().scale.clone(), () => this.getTransform().scale = this.defaultZoom);
    }
    update(delta) {
        this.shrinkAnimation.update(delta);
        this.zoomAnimation.update(delta);
    }
    startZoom() {
        this.zoomAnimation.start();
    }
    startShrink() {
        this.shrinkAnimation.start();
    }
}
