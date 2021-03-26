import SpriteSheetSpec from '../../model/SpriteSheetSpec';
import { createAnim } from '../rendering/animation';
import TileSet from '../rendering/tileSet';
import Loader from './loader';
import { loadImage, loadJson } from './loaders';

export default class TileSetLoader implements Loader<TileSet> {
    constructor(private name: string) {}

    async load(): Promise<TileSet> {
        const sheetSpec = await loadJson<SpriteSheetSpec>(`./sprites/${this.name}.json`);
        const img = await loadImage(sheetSpec.imageURL);

        const tileSet = new TileSet(img, sheetSpec.tileW, sheetSpec.tileH);

        if (sheetSpec.tiles) {
            sheetSpec.tiles.forEach(({ name, index: [x, y] }) => {
                tileSet.defineTile(name, x, y);
            });
        }

        if (sheetSpec.animations) {
            sheetSpec.animations.forEach(animSpec => {
                const animation = createAnim(
                    animSpec.frames,
                    animSpec.frameLen,
                    'loop' in animSpec ? animSpec.loop : true,
                );
                tileSet.defineAnim(animSpec.name, animation);
            });
        }
        return tileSet;
    }
}
