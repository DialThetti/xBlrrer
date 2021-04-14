import { FrameAnimation } from './animation';
import { Canvas, createCanvas } from './render.utils';

export default abstract class ImageContainer {
    images: { [name: string]: Canvas } = {};
    protected animations: { [name: string]: FrameAnimation };

    constructor(protected img: HTMLImageElement) {
        this.images = {};
        this.animations = {};
    }

    protected define(name: string, posX: number, posY: number, width: number, height: number, flipped = false): void {
        const buffer = createCanvas(width, height);

        const context = buffer.getContext('2d');
        if (flipped) {
            context.scale(-1, 1);
            context.translate(-width, 0);
        }
        context.drawImage(this.img, Math.floor(posX), Math.floor(posY), width, height, 0, 0, width, height);
        this.images[name] = buffer;
    }

    isCanvasBlank(canvas: Canvas): boolean {
        return !canvas
            .getContext('2d')
            .getImageData(0, 0, canvas.width, canvas.height)
            .data.some((channel) => channel !== 0);
    }
    public defineAnim(name: string, anim: FrameAnimation): void {
        this.animations[name] = anim;
    }

    protected getImage(name: string): Canvas {
        return this.images[name];
    }
}
