"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimationC = void 0;
const Animation_1 = require("../Helpers/Animation");
const Vector_1 = require("../Helpers/Vector");
const BarRenderer_1 = require("./Renderers/BarRenderer");
const StandaloneComponent_1 = require("./StandaloneComponent");
class AnimationC extends StandaloneComponent_1.StandaloneComponent {
    shrinkAnimation = new Animation_1.GameAnimation();
    zoomAnimation = new Animation_1.GameAnimation();
    defaultZoom = new Vector_1.Vector(1, 1);
    constructor() {
        super();
        this.shrinkAnimation = new Animation_1.GameAnimation((fill) => this.getTransform().scale = this.defaultZoom.times(1 - fill), () => this.getComponent(BarRenderer_1.BarRendererC)?.enable(false), () => this.getGameObject().destroy());
        this.zoomAnimation = new Animation_1.GameAnimation((fill) => this.getTransform().scale = this.defaultZoom.times(1 + Math.sin(Math.PI * fill) / 5), () => this.defaultZoom = this.getTransform().scale.clone(), () => this.getTransform().scale = this.defaultZoom);
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
exports.AnimationC = AnimationC;
