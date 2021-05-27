import { Loader, loadImage } from 'feather-engine-core';
import Font from '../rendering/font';

export default class FontLoader implements Loader<Font> {
    private CHARS = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
    constructor(private fontPath: string) {}
    async load(): Promise<Font> {
        const img = await loadImage(this.fontPath);

        const size = 8;
        const rowLen = img.width;
        const fontSpriteSheet = new Font(img, 8, 8);
        for (const [index, char] of [...this.CHARS].entries()) {
            const x = (index * size) % rowLen;
            const y = Math.floor((index * size) / rowLen) * size;
            fontSpriteSheet.define(char, x, y, size, size);
        }

        return fontSpriteSheet;
    }
}
