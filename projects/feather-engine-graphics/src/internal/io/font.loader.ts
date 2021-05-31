import { Loader, loadImage } from 'feather-engine-core';
import Font from '../font';

export default class FontLoader implements Loader<Font> {
    private CHARS = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
    constructor(private fontPath: string) {}
    async load(): Promise<Font> {
        const img = await this.loadImage();
        const size = 8;
        const rowLen = img.width;
        const fontSpriteSheet = this.createNewFont(img, 8, 8);
        for (const [index, char] of [...this.CHARS].entries()) {
            const x = (index * size) % rowLen;
            const y = Math.floor((index * size) / rowLen) * size;
            fontSpriteSheet.define(char, x, y, size, size);
        }

        return fontSpriteSheet;
    }
    private async loadImage(): Promise<HTMLImageElement> {
        return await loadImage(this.fontPath);
    }

    private createNewFont(img: HTMLImageElement, w: number, h: number): Font {
        return new Font(img, w, h);
    }
}
