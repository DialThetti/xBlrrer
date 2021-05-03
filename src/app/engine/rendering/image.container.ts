import { FrameAnimation } from './animation';
import { Canvas, createCanvas, RenderContext } from './render.utils';

export default abstract class ImageContainer {
    images: { [name: string]: Canvas } = {};
    animations: { [name: string]: FrameAnimation };
    private clearImage: Canvas;
    constructor(protected img: HTMLImageElement) {
        this.images = {};
        this.animations = {};
        this.clearImage = createCanvas(1, 1);
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

    isCanvasBlank(context: RenderContext, width: number, height: number): boolean {
        return !context.getImageData(0, 0, width, height).data.some((channel) => channel !== 0);
    }
    public defineAnim(name: string, anim: FrameAnimation): void {
        this.animations[name] = anim;
    }

    protected getImage(name: string): Canvas {
        return this.images[name];
    }
}

export function mergeImageContainer(t: ImageContainer, c: ImageContainer): ImageContainer {
    t.images = { ...t.images, ...c.images };
    t.animations = { ...t.animations, ...c.animations };
    return t;
}
