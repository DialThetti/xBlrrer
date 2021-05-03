import SpriteSheet from './spriteSheet';

export default class Font extends SpriteSheet {
    print(text: string, context: CanvasRenderingContext2D, x: number, y: number): void {
        for (let index = 0; index < text.length; index++) {
            const f = text.charAt(index);
            this.draw(f, context, x + 8 * index, y);
        }
    }
}
