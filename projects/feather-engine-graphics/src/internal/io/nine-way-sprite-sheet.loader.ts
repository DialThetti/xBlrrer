import { Canvas, Loader, loadImage } from 'feather-engine-core';
import NineWaySpriteSheet from '../nine-way-sprite-sheet';

export default class NineWaySpriteSheetLoader implements Loader<NineWaySpriteSheet> {
    constructor(private name: string) {}

    async load(): Promise<NineWaySpriteSheet> {
        const img = await this.loadImage();

        const nineWayFrame = new NineWaySpriteSheet(img, false);
        return nineWayFrame;
    }

    //For test purposes
    async loadImage(): Promise<Canvas> {
        return await loadImage(this.name);
    }
}
