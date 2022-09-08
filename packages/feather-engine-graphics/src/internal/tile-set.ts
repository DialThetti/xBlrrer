import { Canvas, FeatherEngine, RenderContext } from '@dialthetti/feather-engine-core';
import { drawRect } from './helper';
import ImageContainer from './image-container';

export default class TileSet extends ImageContainer {
    tilesize: number;
    constructor(img: Canvas, private width: number, private height: number) {
        super(img);
        this.tilesize = height;
    }

    public defineTile(name: string, posX: number, posY: number): void {
        this.define(name, posX * this.width, posY * this.height, this.width, this.height);
    }

    public isAnimatedTile(name: string): boolean {
        return !!this.animations[name];
    }

    public drawAnim(name: string, context: RenderContext, x: number, y: number, distance: number): void {
        const anim = this.animations[name];
        if (anim) {
            this.drawTile(anim(distance), context, Math.floor(x), Math.floor(y));
        }
    }

    public drawTile(name: string, context: RenderContext, x: number, y: number): void {
        this.draw(name, context, Math.floor(this.width * x), Math.floor(this.height * y));
    }

    private draw(name: string, context: RenderContext, x: number, y: number): void {
        const image = this.getImage(name);
        if (image) {
            context.drawImage(image.img, image.x, image.y, image.width, image.height, x, y, image.width, image.height);
        } else {
            if (FeatherEngine.debugSettings.enabled) {
                drawRect(context, x, y, this.width, this.height, 'magenta', { filled: true });
            } else {
                context.clearRect(x, y, this.width, this.height);
            }
        }
    }
}
