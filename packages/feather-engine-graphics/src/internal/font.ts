import { Canvas, RenderContext } from '@dialthetti/feather-engine-core';
import SpriteSheet from './sprite-sheet';

export default class Font extends SpriteSheet {
    constructor(img: Canvas, w: number, h: number) {
        super(img, w, h, false);
    }

    print(text: string, context: RenderContext, x: number, y: number): void {
        for (let index = 0; index < text.length; index++) {
            const f = text.charAt(index);
            this.draw(f, context, x + 8 * index, y);
        }
    }
}
