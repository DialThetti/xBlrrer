import { RenderContext } from 'feather-engine-core';

export function drawRect(
    context: RenderContext | CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    color: string,
    options = { filled: false },
): void {
    if (options.filled) {
        context.fillStyle = color;
        context.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
        return;
    }
    context.strokeStyle = color;

    context.beginPath();
    context.rect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
    context.stroke();
}
