import { RenderContext } from './render.utils';

export function drawRect(
    context: RenderContext,
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
