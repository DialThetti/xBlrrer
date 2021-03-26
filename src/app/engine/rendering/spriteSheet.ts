import { drawRect } from './helper';
import { debug } from '../debug';
import { FrameAnimation } from './animation';
import ImageContainer from './image.container';

export default class SpriteSheet extends ImageContainer {
    constructor(img: HTMLImageElement, private w: number, private h: number) {
        super(img);
    }

    public define(name: string, posX: number, posY: number, width: number, height: number): void {
        super.define(name, posX, posY, width, height, false);
        super.define(name + '_switched', posX, posY, width, height, true);
    }

    public draw(name: string, context: CanvasRenderingContext2D, x: number, y: number, flipped = false): void {
        const image = this.getImage(name + (flipped ? '_switched' : ''));
        if (image) {
            context.drawImage(image, x, y);
        } else {
            if (debug) {
                drawRect(context, x, y, 16, 16, 'magenta', { filled: true });
            } else {
                context.clearRect(x, y, 16, 16);
            }
        }
    }

    getAnimation(name: string): FrameAnimation {
        const anim = this.animations[name];
        return anim ? anim : (): string => '';
    }
}
