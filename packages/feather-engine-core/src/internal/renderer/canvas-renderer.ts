export type Canvas = HTMLCanvasElement | HTMLImageElement;
export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private internalContext: RenderingContext;

  constructor({ canvasId }: { canvasId: string }) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement;
    const c = this.canvas.getContext('2d');
    //const c = this.canvas.getContext('webgl') || this.canvas.getContext('experimental-webgl');
    this.internalContext = c as RenderingContext;
  }

  get context(): RenderContext {
    return this.internalContext as RenderContext;
  }

  public static createRenderContext(width: number, height: number): RenderContext {
    const canvas = CanvasRenderer.createCanvas(width, height) as any;
    const context = canvas.getContext('2d') as RenderContext;
    return context;
  }

  private static createCanvas(width: number, height: number): HTMLCanvasElement {
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
    h2?: number
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
