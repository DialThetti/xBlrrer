import { FrameAnimation } from './animation';
import { Canvas, createCanvas } from './render.utils';

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
        if (this.isCanvasBlank(buffer)) {
            // the sprite is empty, so no need to save it
            this.images[name] = this.clearImage;
            return;
        }
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

export function mergeImageContainer(t: ImageContainer, c: ImageContainer): ImageContainer {
    t.images = { ...t.images, ...c.images };
    t.animations = { ...t.animations, ...c.animations };
    return t;
}
