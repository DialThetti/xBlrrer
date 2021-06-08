import { Canvas, CanvasRenderer, error } from 'feather-engine-core';
import { FrameAnimation } from './animation';

interface ImagePosReferences {
    img: Canvas;
    pos: { [name: string]: { x: number; y: number; height: number; width: number } };
}
export default abstract class ImageContainer {
    animations: { [name: string]: FrameAnimation };

    ref: ImagePosReferences[] = [];
    constructor(protected img: Canvas, protected flippable = false) {
        this.animations = {};

        this.ref = [{ img, pos: {} }];
        if (flippable) {
            const mirrored = CanvasRenderer.createRenderContext(img.width, img.height);
            mirrored.scale(-1, 1);
            mirrored.translate(-img.width, 0);
            mirrored.drawImage(this.img, 0, 0);
            this.ref.push({ img: mirrored.canvas, pos: {} });
        }
    }

    protected define(name: string, posX: number, posY: number, width: number, height: number, flipped = false): void {
        if (!flipped) {
            this.ref[0].pos[name] = { x: posX, y: posY, width, height };
        } else {
            if (!this.flippable) {
                error(this, 'This imagecontainer is not flippable, however, a flipped tile was tried to defined.');
            }
            this.ref[1].pos[name] = { x: this.ref[1].img.width - width - posX, y: posY, width, height };
        }
    }

    public defineAnim(name: string, anim: FrameAnimation): void {
        this.animations[name] = anim;
    }

    protected getImage(name: string): { img: Canvas; x: number; y: number; height: number; width: number } | undefined {
        const r = this.ref.filter((a) => !!a.pos[name])[0];
        if (!r) return undefined;
        return { img: r.img, ...r.pos[name] };
    }
}

export function mergeImageContainer(t: ImageContainer, c: ImageContainer): ImageContainer {
    t.animations = { ...t.animations, ...c.animations };
    t.ref = [...t.ref, ...c.ref];
    return t;
}
