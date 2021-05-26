import { Canvas, CanvasRenderer } from 'feather-engine-core';
import { FrameAnimation } from './animation';

export default abstract class ImageContainer {
    images: { [name: string]: Canvas } = {};
    animations: { [name: string]: FrameAnimation };
    constructor(protected img: HTMLImageElement) {
        this.images = {};
        this.animations = {};
    }

    protected define(name: string, posX: number, posY: number, width: number, height: number, flipped = false): void {
        const context = CanvasRenderer.createRenderContext(width, height);

        if (flipped) {
            context.scale(-1, 1);
            context.translate(-width, 0);
        }
        context.drawImage(this.img, Math.floor(posX), Math.floor(posY), width, height, 0, 0, width, height);

        this.images[name] = context.canvas;
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
