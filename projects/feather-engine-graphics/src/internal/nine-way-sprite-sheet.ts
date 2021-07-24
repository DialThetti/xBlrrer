import { Canvas, FeatherEngine, RenderContext } from 'feather-engine-core';
import { drawRect } from './helper';
import ImageContainer from './image-container';

export default class NineWaySpriteSheet extends ImageContainer {
    tileWidth: number;
    tileHeight: number;
    constructor(protected img: Canvas, protected flippable = false) {
        super(img, flippable);
        const width = img.width / 3;
        const height = img.height / 3;
        this.define('nw', 0, 0, width, height);
        this.define('n', width, 0, width, height);
        this.define('ne', 2 * width, 0, width, height);
        this.define('w', 0, height, width, height);
        this.define('c', width, height, width, height);
        this.define('e', 2 * width, height, width, height);
        this.define('sw', 0, 2 * height, width, height);
        this.define('s', width, 2 * height, width, height);
        this.define('se', 2 * width, 2 * height, width, height);
        this.tileWidth = width;
        this.tileHeight = height;
    }
    public draw(context: RenderContext, x: number, y: number, width: number, height: number): void {
        for (let i = 0; i < width; i += this.tileWidth) {
            for (let j = 0; j < height; j += this.tileHeight) {
                // TODO 9 way rendering
                const id = this.getDir(i, j, width - this.tileWidth, height - this.tileHeight);
                const image = this.getImage(id);
                if (image) {
                    context.drawImage(
                        image.img,
                        image.x,
                        image.y,
                        image.width,
                        image.height,
                        i + x,
                        j + y,
                        image.width,
                        image.height,
                    );
                } else {
                    if (FeatherEngine.debugSettings.enabled) {
                        drawRect(context, x, y, width, height, 'magenta', { filled: true });
                    } else {
                        context.clearRect(x, y, width, height);
                    }
                }
            }
        }
    }

    private getDir(x: number, y: number, w: number, h: number) {
        const a = x == 0 ? 0 : x == w ? 2 : 1;
        const b = y == 0 ? 0 : y == h ? 2 : 1;
        return [
            ['nw', 'n', 'ne'],
            ['w', 'c', 'e'],
            ['sw', 's', 'se'],
        ][b][a];
    }
}
