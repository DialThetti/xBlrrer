import { debug } from '../debug';
import { drawRect } from './helper';
import ImageContainer from './image.container';

export default class TileSet extends ImageContainer {
    tilesize: number;
    constructor(img: HTMLImageElement, private width: number, private height: number) {
        super(img);
        this.tilesize = height;
    }

    public defineTile(name: string, posX: number, posY: number): void {
        this.define(name, posX * this.width, posY * this.height, this.width, this.height);
    }

    public isAnimatedTile(name: string): boolean {
        return !!this.animations[name];
    }

    public drawAnim(name: string, context: CanvasRenderingContext2D, x: number, y: number, distance: number): void {
        const anim = this.animations[name];
        if (anim) {
            this.drawTile(anim(distance), context, Math.floor(x), Math.floor(y));
        }
    }

    public drawTile(name: string, context: CanvasRenderingContext2D, x: number, y: number): void {
        this.draw(name, context, Math.floor(this.width * x), Math.floor(this.height * y));
    }

    private draw(name: string, context: CanvasRenderingContext2D, x: number, y: number): void {
        const tileImage = this.getImage(name);
        if (tileImage) {
            context.drawImage(tileImage, x, y);
        } else {
            if (debug) {
                drawRect(context, x, y, this.width, this.height, 'magenta', { filled: true });
            } else {
                context.clearRect(x, y, this.width, this.height);
            }
        }
    }
}
