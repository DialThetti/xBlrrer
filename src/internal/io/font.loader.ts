import { Canvas, Loader, loadImage } from '@dialthetti/feather-engine-core';
import Font from '../font';

export default class FontLoader implements Loader<Font> {
    private chars = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
    constructor(private fontPath: string) {}
    async load(): Promise<Font> {
        const img = await this.loadImage();
        const size = 8;
        const rowLen = img.width;
        const fontSpriteSheet = this.createNewFont(img, 8, 8);

        for (let index = 0; index < this.chars.length; index++) {
            const char = this.chars.charAt(index);
            const x = (index * size) % rowLen;
            const y = Math.floor((index * size) / rowLen) * size;
            fontSpriteSheet.define(char, x, y, size, size);
        }

        return fontSpriteSheet;
    }
    // for test purpose
    async loadImage(): Promise<Canvas> {
        return loadImage(this.fontPath);
    }

    private createNewFont(img: Canvas, w: number, h: number): Font {
        return new Font(img, w, h);
    }
}
