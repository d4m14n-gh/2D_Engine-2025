import { ColliderRendererC } from "../Components/Renderers/ColliderRenderer";
import { BarRendererC } from "../Components/Renderers/BarRenderer";
import { TextRendererC } from "../Components/Renderers/TextRenderer";
import { Plugin } from "../Core/Plugin";
import { CameraPlugin } from "./Camera";
import { ImageRendererC } from "../Components/Renderers/ImageRenderer";
import { PolygonRendererC } from "../Components/Renderers/PolygonRenderer";
import { CanonRendererC } from "../Components/Renderers/CanonRenderer";
import { ChasisRendererC } from "../Components/Renderers/ChasisRenderer";
import { TracesRendererC } from "../Components/Renderers/TracesRenderer";
export class RendererPlugin extends Plugin {
    context;
    hud = new Hud();
    renderDistance = 150;
    constructor(context) {
        super();
        this.context = context;
    }
    addVignetteEffect(context, color) {
        const centerX = context.canvas.width / 2;
        const centerY = context.canvas.height / 2;
        const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY);
        const gradient = context.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxRadius);
        gradient.addColorStop(0.1, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, color);
        context.fillStyle = gradient;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }
    drawDotGrid(context, gridSize, dotSize, dotColor) {
        const canvasWidth = context.canvas.width;
        const canvasHeight = context.canvas.height;
        const scale = this.getPlugin(CameraPlugin).scale;
        const camera = this.getPlugin(CameraPlugin).cameraPositon;
        gridSize *= scale;
        dotSize *= scale;
        context.fillStyle = dotColor;
        for (let x = (canvasWidth / 2 - camera.x * scale) % gridSize; x <= canvasWidth; x += gridSize) {
            for (let y = (canvasHeight / 2 + camera.y * scale) % gridSize; y <= canvasHeight; y += gridSize) {
                context.beginPath();
                context.arc(x, y, dotSize / 2, 0, Math.PI * 2);
                context.fill();
            }
        }
    }
    drawGrid(context, gridSize, lineColor) {
        const canvasWidth = context.canvas.width;
        const canvasHeight = context.canvas.height;
        const scale = this.getPlugin(CameraPlugin).scale;
        const camera = this.getPlugin(CameraPlugin).cameraPositon;
        context.save();
        gridSize *= scale;
        context.strokeStyle = lineColor;
        context.lineWidth = 0.1 * scale;
        context.beginPath();
        for (let x = (canvasWidth / 2 - camera.x * scale) % gridSize; x <= canvasWidth; x += gridSize) {
            context.moveTo(x, 0);
            context.lineTo(x, canvasHeight);
        }
        for (let y = (canvasHeight / 2 + camera.y * scale) % gridSize; y <= canvasHeight; y += gridSize) {
            context.moveTo(0, y);
            context.lineTo(canvasWidth, y);
        }
        context.stroke();
        context.restore();
    }
    start() {
        ////
        this.context.imageSmoothingEnabled = true;
        this.context.strokeStyle = "rgb(43,43,44)";
        this.context.lineWidth = 0.175;
        this.context.lineJoin = "round";
        this.context.shadowColor = 'rgba(0, 0, 0, 0.75)';
        ////
    }
    update(delta) {
        const width = this.context.canvas.width;
        const height = this.context.canvas.height;
        // this.context.fillStyle = new Color(113, 111, 107).toString();
        this.context.fillStyle = "#716f6b";
        this.context.fillStyle = "rgb(85, 106, 86)";
        this.context.fillRect(0, 0, width, height);
        this.drawGrid(this.context, 10, "rgb(43,43,44)");
        this.gameWorld.getComponents(TextRendererC)
            .concat(this.gameWorld.getComponents(ColliderRendererC))
            .concat(this.gameWorld.getComponents(BarRendererC))
            .concat(this.gameWorld.getComponents(PolygonRendererC))
            .concat(this.gameWorld.getComponents(ImageRendererC))
            .concat(this.gameWorld.getComponents(CanonRendererC))
            .concat(this.gameWorld.getComponents(TracesRendererC))
            .concat(this.gameWorld.getComponents(ChasisRendererC))
            .filter(renderer => renderer.getTransform().position.distance(this.getPlugin(CameraPlugin).cameraPositon) < this.renderDistance)
            .sort((a, b) => a.zindex - b.zindex).forEach(renderer => renderer.render(this.context));
        // this.gameWorld.getAllComponents<RendererC>(RendererC.name).forEach(renderer => renderer.render(this.context));
        this.hud.draw(this.context);
        this.addVignetteEffect(this.context, 'rgba(0, 0, 0, 0.3)');
    }
}
export class Hud {
    texts = new Map();
    setLabel(key, pos, text) {
        this.texts.set(key, { pos, text });
    }
    removeLabel(key) {
        this.texts.delete(key);
    }
    draw(context) {
        for (const element of this.texts.values())
            this.drawText(element.text, element.pos, context);
    }
    drawText(text, position, context) {
        context.save();
        context.translate(position.x, position.y);
        const textHeight = 30.0;
        context.font = "bold " + textHeight + "px Arial";
        context.fillStyle = "azure";
        context.lineWidth = 0.175 * 30;
        const offset = 0; //context.measureText(text).width/2;
        context.strokeText(text, -offset, textHeight / 4);
        context.fillText(text, -offset, textHeight / 4);
        context.restore();
    }
}
