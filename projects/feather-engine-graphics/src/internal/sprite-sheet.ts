import { Canvas, FeatherEngine, RenderContext } from 'feather-engine-core';
import { FrameAnimation } from './animation';
import { drawRect } from './helper';
import ImageContainer from './image-container';

export default class SpriteSheet extends ImageContainer {
    constructor(img: Canvas, private w: number, private h: number, flippable = true) {
        super(img, flippable);
    }

    public define(name: string, posX: number, posY: number, width: number, height: number): void {
        super.define(name, posX, posY, width, height, false);
        if (this.flippable) super.define(name + '_switched', posX, posY, width, height, true);
    }

    public draw(name: string, context: RenderContext, x: number, y: number, flipped = false): void {
        const image = this.getImage(name + (flipped ? '_switched' : ''));
        if (image) {
            context.drawImage(image.img, image.x, image.y, image.width, image.height, x, y, image.width, image.height);
        } else {
            if (FeatherEngine.debugSettings.enabled) {
                drawRect(context, x, y, this.w, this.h, 'magenta', { filled: true });
            } else {
                context.clearRect(x, y, this.w, this.h);
            }
        }
    }

    public getAnimation(name: string): FrameAnimation {
        const anim = this.animations[name];
        if (anim) {
            return anim;
        }
        return () => '';
    }
}
