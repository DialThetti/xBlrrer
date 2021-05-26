import { RenderContext } from 'feather-engine-core';
import SpriteSheet from './spriteSheet';

export default class Font extends SpriteSheet {
    print(text: string, context: RenderContext, x: number, y: number): void {
        for (let index = 0; index < text.length; index++) {
            const f = text.charAt(index);
            this.draw(f, context, x + 8 * index, y);
        }
    }
}
