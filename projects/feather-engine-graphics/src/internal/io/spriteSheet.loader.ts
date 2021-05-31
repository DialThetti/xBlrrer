import { Loader, loadImage, loadJson } from 'feather-engine-core';
import { createAnim } from '../animation';
import SpriteSheetModel from '../model/sprite-sheet-model';
import SpriteSheet from '../spriteSheet';

export default class SpriteSheetLoader implements Loader<SpriteSheet> {
    constructor(private name: string) {}

    async load(): Promise<SpriteSheet> {
        const sheetSpec = await loadJson<SpriteSheetModel>(`./sprites/${this.name}.json`);
        const img = await loadImage(sheetSpec.imageURL);

        const sprites = new SpriteSheet(img, sheetSpec.tileW, sheetSpec.tileH);

        if (sheetSpec.frames) {
            sheetSpec.frames.forEach(({ name, rect: [x, y, w, h] }) => {
                sprites.define(name, x, y, w, h);
            });
        }

        if (sheetSpec.animations) {
            sheetSpec.animations.forEach((animSpec) => {
                const animation = createAnim(animSpec.frames, animSpec.frameLen, animSpec?.loop ?? false);
                sprites.defineAnim(animSpec.name, animation);
            });
        }
        return sprites;
    }
}
