import { FrameAnimation } from './animation';

export default abstract class ImageContainer {
    private images: { [name: string]: HTMLCanvasElement } = {};
    protected animations: { [name: string]: FrameAnimation };

    constructor(protected img: HTMLImageElement) {
        this.images = {};
        this.animations = {};
    }

    protected define(name: string, posX: number, posY: number, width: number, height: number, flipped = false): void {
        const buffer = document.createElement('canvas');
        buffer.width = width;
        buffer.height = height;

        const context = buffer.getContext('2d');
        if (flipped) {
            context.scale(-1, 1);
            context.translate(-width, 0);
        }
        context.drawImage(this.img, Math.floor(posX), Math.floor(posY), width, height, 0, 0, width, height);
        this.images[name] = buffer;
    }

    public defineAnim(name: string, anim: FrameAnimation): void {
        this.animations[name] = anim;
    }

    protected getImage(name: string): HTMLCanvasElement {
        return this.images[name];
    }
}
