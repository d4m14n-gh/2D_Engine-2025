import { Vector } from "../../Helpers/Vector";

async function drawHexGrid(context: OffscreenCanvasRenderingContext2D, gridSize: Vector, dotSize: number, lineColor: string, scale: Vector) {
    const canvasWidth = context.canvas.width;
    const canvasHeight = context.canvas.height;
    const size = gridSize.x * Math.abs(scale.x)/2;
    const width = Math.sqrt(3) * size;
    const height = 2 * size;
    const vertSpacing = 0.75 * height;

    context.strokeStyle = lineColor;
    context.lineWidth = dotSize * scale.x;
    function drawHexagon(cx: number, cy: number) {
        context.beginPath();
        for (let i = 0; i < 6; i++) {
            const angle = Math.PI / 180 * (60 * i - 30); // pointy-top
            const x = cx + size * Math.cos(angle);
            const y = cy + size * Math.sin(angle);
            if (i === 0) context.moveTo(x, y);
            else context.lineTo(x, y);
        }
        context.closePath();
        context.shadowColor =  'rgba(0, 0, 0, 0.75)';
        context.shadowBlur = 55;
        context.stroke();
    }
    for (let row = 0; row * vertSpacing < canvasHeight + height; row++) {
        const y = (canvasHeight / 2) %(3*size) + row * vertSpacing;
        const offsetX = (row % 2) * (width / 2);
        for (let col = 0; col * width + offsetX < canvasWidth + width; col++) {
            const x = (canvasWidth / 2) % width + col * width + offsetX;
            drawHexagon(x, y);
            await new Promise(r => setTimeout(r, 0));
        }
    }
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.shadowBlur = 0;
}

async function drawGrid(context: CanvasRenderingContext2D, gridSize: Vector, dotSize: number, lineColor: string, scale: Vector) {
    const canvasWidth = context.canvas.width;
    const canvasHeight = context.canvas.height;

    gridSize.x *= Math.abs(scale.x);
    gridSize.y *= Math.abs(scale.y);
    context.strokeStyle = lineColor;
    context.lineWidth = dotSize * scale.x;
    context.beginPath();
    for (let x = (canvasWidth / 2) % gridSize.x; x <= canvasWidth; x += gridSize.x) {
        context.moveTo(x, 0);
        context.lineTo(x, canvasHeight);
        // await new Promise(r => setTimeout(r, 10));
    }

    for (let y = (canvasHeight / 2) % gridSize.y; y <= canvasHeight; y += gridSize.y) {
        context.moveTo(0, y);
        context.lineTo(canvasWidth, y);
        // await new Promise(r => setTimeout(r, 10));
    }
    context.stroke();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.shadowBlur = 0;
}
  

async function drawDotGrid(context: OffscreenCanvasRenderingContext2D, gridSize: Vector, dotSize: number, dotColor: string, scale: Vector) {
    const canvasWidth = context.canvas.width;
    const canvasHeight = context.canvas.height;

    gridSize.x *= scale.x;
    gridSize.y *= scale.y;
    dotSize *= scale.x;
    context.fillStyle = dotColor;
    for (let y = (canvasHeight/2)%gridSize.y; y <= canvasHeight; y += gridSize.y) {
        for (let x =  (canvasWidth/2)%gridSize.x; x <= canvasWidth; x += gridSize.x) {
            context.beginPath();
            context.arc(x, y, dotSize / 2, 0, Math.PI * 2);
            context.fill();
            context.shadowColor =  'rgba(0, 0, 0, 0.75)';
            context.shadowBlur = 35;
            context.stroke();
            await new Promise(r => setTimeout(r, 1));
        }
    }
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.shadowBlur = 0;
}

onmessage = async (event) => {
    const offscreenCanvas = event.data.canvas;
    const ctx = offscreenCanvas.getContext("2d");
    if (!ctx) return;

    let args: any = event.data.args;
    // await drawDotGrid(ctx, args[0], 0.1, args[2], args[3]);
    await drawGrid(ctx, args[0], 0.075, args[2], args[3]);
    // await drawHexGrid(ctx, args[0], 0.05, args[2], args[3]);
};
