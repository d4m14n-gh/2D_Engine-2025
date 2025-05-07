import { ColliderRendererC } from "../Components/Renderers/ColliderRenderer";
import { BarRendererC } from "../Components/Renderers/BarRenderer";
import { TextRendererC } from "../Components/Renderers/TextRenderer";
import { rgb } from "../Helpers/Color";
import { Plugin } from "../Core/Plugin";
import { CameraPlugin } from "./Camera";
import { ImageRendererC } from "../Components/Renderers/ImageRenderer";
import { PolygonRendererC } from "../Components/Renderers/PolygonRenderer";
import { CanonRendererC } from "../Components/Renderers/CanonRenderer";
import { Vector } from "../Helpers/Vector";
import { ChasisRendererC } from "../Components/Renderers/ChasisRenderer";
import { TracesRendererC } from "../Components/Renderers/TracesRenderer";
export class RendererPlugin extends Plugin {
    name = "RendererPlugin";
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
        gradient.addColorStop(0.25, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, color);
        context.fillStyle = gradient;
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
    }
    drawDotGrid(context, gridSize, dotSize, dotColor) {
        const canvasWidth = context.canvas.width;
        const canvasHeight = context.canvas.height;
        const scale = this.getPlugin(CameraPlugin).scale;
        const camera = this.getPlugin(CameraPlugin).cameraPositon;
        gridSize.x *= scale.x;
        gridSize.y *= scale.y;
        dotSize *= scale.x;
        context.fillStyle = dotColor;
        for (let x = (canvasWidth / 2 - camera.x * scale.x) % gridSize.x; x <= canvasWidth; x += gridSize.x) {
            for (let y = (canvasHeight / 2 - camera.y * scale.y) % gridSize.y; y <= canvasHeight; y += gridSize.y) {
                context.beginPath();
                context.arc(x, y, dotSize / 2, 0, Math.PI * 2);
                context.fill();
            }
        }
    }
    drawGrid(context, gridSize, lineColor, scale) {
        const canvasWidth = context.canvas.width;
        const canvasHeight = context.canvas.height;
        context.save();
        gridSize.x *= Math.abs(scale.x);
        gridSize.y *= Math.abs(scale.y);
        context.strokeStyle = lineColor;
        context.lineWidth = 0.1 * scale.x;
        context.beginPath();
        for (let x = (canvasWidth / 2) % gridSize.x; x <= canvasWidth; x += gridSize.x) {
            context.moveTo(x, 0);
            context.lineTo(x, canvasHeight);
        }
        for (let y = (canvasHeight / 2) % gridSize.y; y <= canvasHeight; y += gridSize.y) {
            context.moveTo(0, y);
            context.lineTo(canvasWidth, y);
        }
        context.stroke();
        context.restore();
    }
    drawHexGrid(context, gridSize, // gridSize.x = radius, gridSize.y is ignored
    lineColor, scale) {
        const canvasWidth = context.canvas.width;
        const canvasHeight = context.canvas.height;
        context.save();
        const size = gridSize.x * Math.abs(scale.x);
        const width = Math.sqrt(3) * size;
        const height = 2 * size;
        const vertSpacing = 0.75 * height;
        context.strokeStyle = lineColor;
        context.lineWidth = 0.05 * scale.x;
        function drawHexagon(cx, cy) {
            context.beginPath();
            for (let i = 0; i < 6; i++) {
                const angle = Math.PI / 180 * (60 * i - 30); // pointy-top
                const x = cx + size * Math.cos(angle);
                const y = cy + size * Math.sin(angle);
                if (i === 0)
                    context.moveTo(x, y);
                else
                    context.lineTo(x, y);
            }
            context.closePath();
            context.stroke();
        }
        for (let row = 0; row * vertSpacing < canvasHeight + height; row++) {
            const y = (canvasHeight / 2) % (3 * size) + row * vertSpacing;
            const offsetX = (row % 2) * (width / 2);
            for (let col = 0; col * width + offsetX < canvasWidth + width; col++) {
                const x = (canvasWidth / 2) % width + col * width + offsetX;
                drawHexagon(x, y);
            }
        }
        context.restore();
    }
    gridCanvas = [];
    start() {
        ////
        this.context.imageSmoothingEnabled = true;
        this.context.strokeStyle = "rgb(43,43,44)";
        this.context.lineWidth = 0.175;
        this.context.lineJoin = "round";
        this.context.shadowColor = 'rgba(0, 0, 0, 0.75)';
        ////
        for (let i = 0; i < 10; i++) {
            this.gridCanvas[i] = document.createElement("canvas");
            this.gridCanvas[i].width = 3440;
            this.gridCanvas[i].height = 1440;
            document.createElement("canvas");
            const ctx = this.gridCanvas[i].getContext("2d");
            if (ctx)
                this.drawHexGrid(ctx, new Vector(2.5, 2.5), new rgb(62, 78, 64).toString(), new Vector(i * 5 + 9, i * 5 + 9));
        }
    }
    update(delta) {
        const width = this.context.canvas.width;
        const height = this.context.canvas.height;
        // this.context.fillStyle = new Color(113, 111, 107).toString();
        this.context.fillStyle = "#716f6b";
        this.context.fillStyle = "rgb(85, 106, 86)";
        this.context.fillStyle = "rgb(66, 85, 68)";
        this.context.fillRect(0, 0, width, height);
        this.getPlugin(CameraPlugin).cameraOffset = new Vector(this.context.canvas.width / 2, this.context.canvas.height / 2);
        // this.drawDotGrid(this.context, 10, 0.175, "rgb(43,43,44)");
        this.context.save();
        let gx = Math.sqrt(3) * 2.5;
        let gy = 3 * 2.5;
        const offset = this.getPlugin(CameraPlugin).cameraOffset;
        const scale = this.getPlugin(CameraPlugin).scale;
        // const scale = new Vector(5, 5);
        const cpos = this.getPlugin(CameraPlugin).cameraPositon;
        let i = Math.max(0, Math.min(9, Math.round(scale.x / 10) - 1));
        let c = i * 5 + 9;
        this.context.translate(offset.x, offset.y);
        this.context.scale(scale.x, scale.y);
        this.context.translate((-cpos.x) % gx, (-cpos.y) % gy);
        this.context.scale(1 / c, 1 / c);
        // this.context.imageSmoothingEnabled = false;
        this.context.drawImage(this.gridCanvas[i], -this.gridCanvas[i].width / 2, -this.gridCanvas[i].height / 2, this.gridCanvas[i].width, this.gridCanvas[i].height);
        this.context.restore();
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
