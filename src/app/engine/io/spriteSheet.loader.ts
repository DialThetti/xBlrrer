import SpriteSheetSpec from '../../model/SpriteSheetSpec';
import { createAnim } from '../rendering/animation';
import SpriteSheet from '../rendering/spriteSheet';
import Loader from './loader';
import { loadImage, loadJson } from './loaders';

export default class SpriteSheetLoader implements Loader<SpriteSheet> {
    constructor(private name: string) {}

    async load(): Promise<SpriteSheet> {
        const sheetSpec = await loadJson<SpriteSheetSpec>(`./sprites/${this.name}.json`);
        const img = await loadImage(sheetSpec.imageURL);

        const sprites = new SpriteSheet(img, sheetSpec.tileW, sheetSpec.tileH);

        if (sheetSpec.frames) {
            sheetSpec.frames.forEach(({ name, rect: [x, y, w, h] }) => {
                sprites.define(name, x, y, w, h);
            });
        }

        if (sheetSpec.animations) {
            sheetSpec.animations.forEach((animSpec) => {
                const animation = createAnim(
                    animSpec.frames,
                    animSpec.frameLen,
                    'loop' in animSpec ? animSpec.loop : true,
                );
                sprites.defineAnim(animSpec.name, animation);
            });
        }
        return sprites;
    }
}
