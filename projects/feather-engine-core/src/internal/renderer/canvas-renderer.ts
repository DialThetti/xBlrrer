export type Canvas = OffscreenCanvas | HTMLCanvasElement | HTMLImageElement;

export class CanvasRenderer {
    private canvas: HTMLCanvasElement;
    private _context: RenderingContext;

    constructor({ canvasId }: { canvasId: string }) {
        this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        const c = this.canvas.getContext('2d');
        //const c = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
        this._context = c as RenderingContext;
    }

    get context(): RenderContext {
        return this._context as RenderContext;
    }

    public static createRenderContext(width: number, height: number): RenderContext {
        const canvas = CanvasRenderer.createCanvas(width, height) as any;
        const context = canvas.getContext('2d') as RenderContext;
        return context;
    }

    private static createCanvas(width: number, height: number): OffscreenCanvas | HTMLCanvasElement {
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
}

export interface RenderContext {
    // The renderingTarget
    canvas: Canvas;
    clearRect(x: number, y: number, w: number, h: number): void;
    drawImage(
        tileImage: Canvas,
        x: number,
        y: number,
        w?: number,
        h?: number,
        x2?: number,
        y2?: number,
        w2?: number,
        h2?: number,
    ): void;
    // Only for DrawRect....
    beginPath(): void;
    rect(x: number, y: number, w: number, h: number): void;
    fillRect(x: number, y: number, w: number, h: number): void;
    stroke(): void;
    strokeStyle: string;
    fillStyle: string;
    scale(x: number, y: number): void;
    translate(x: number, y: number): void;
}
