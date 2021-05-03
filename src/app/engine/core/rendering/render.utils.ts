export function createCanvas(width: number, height: number): Canvas {
    if (typeof OffscreenCanvas === 'function') {
        /* OffscreenCanvas is a class for Chrome, which should be used due inperformance of createCanvas('canvas'),
         * currently still experimental,
         * see https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas/OffscreenCanvas
         */
        return new OffscreenCanvas(width, height);
    }

    const buffer = document.createElement('canvas');
    buffer.width = width;
    buffer.height = height;
    return buffer;
}

export type Canvas = OffscreenCanvas | HTMLCanvasElement;
export type RenderContext = OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;
