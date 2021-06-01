import { Loader, loadImage, loadJson } from 'feather-engine-core';
import { createAnim } from '../animation';
import SpriteSheetModel from '../model/sprite-sheet-model';
import SpriteSheet from '../sprite-sheet';

export default class SpriteSheetLoader implements Loader<SpriteSheet> {
    constructor(private name: string) {}

    async load(): Promise<SpriteSheet> {
        const sheetSpec = await this.loadSheetSpec();
        const img = await this.loadImage(sheetSpec.imageURL);

        const sprites = this.createNewSpriteSheet(img, sheetSpec.tileW, sheetSpec.tileH);

        if (sheetSpec.frames) {
            sheetSpec.frames.forEach(({ name, rect: [x, y, w, h] }) => {
                sprites.define(name, x, y, w, h);
            });
        }

        if (sheetSpec.animations) {
            sheetSpec.animations.forEach((animSpec) => {
                const animation = createAnim(animSpec.frames, animSpec.frameLen, animSpec?.loop ?? true);
                sprites.defineAnim(animSpec.name, animation);
            });
        }
        return sprites;
    }

    private async loadSheetSpec(): Promise<SpriteSheetModel> {
        return loadJson<SpriteSheetModel>(`./sprites/${this.name}.json`);
    }

    private async loadImage(imgPath: string): Promise<HTMLImageElement> {
        return loadImage(imgPath);
    }

    private createNewSpriteSheet(img: HTMLImageElement, w: number, h: number): SpriteSheet {
        return new SpriteSheet(img, w, h);
    }
}
