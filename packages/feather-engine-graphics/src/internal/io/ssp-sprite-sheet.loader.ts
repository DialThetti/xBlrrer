import { Loader, ResourceLoader } from '@dialthetti/feather-engine-core';
import { createAnim } from '../animation';
import { AnimatedSSPSpriteSheet, SSPSpriteSheet } from '../model/ssp-sprite-sheet-model';
import SpriteSheet from '../sprite-sheet';

export default class SSPSpriteSheetLoader implements Loader<SpriteSheet> {
    loader = new ResourceLoader();

    constructor(private basePath: string, private name: string) {}

    async load(): Promise<SpriteSheet> {
        const sheetSpec = await this.loader.loadJson<SSPSpriteSheet | AnimatedSSPSpriteSheet>(
            `${this.basePath}/${this.name}.json`,
        );
        const img = await this.loader.loadImage(`${this.basePath}/${sheetSpec.meta.image}`);

        const sprites = new SpriteSheet(img, sheetSpec.meta.size.w, sheetSpec.meta.size.h);

        if (sheetSpec.frames) {
            Object.keys(sheetSpec.frames)
                .map((name) => ({ name, data: sheetSpec.frames[name].frame }))
                .forEach(({ name, data }) => {
                    sprites.define(name, data.x, data.y, data.w, data.h);
                });
        }

        if (this.isAnimated(sheetSpec)) {
            Object.keys(sheetSpec.animations)
                .map((name) => ({ name, data: sheetSpec.animations[name] }))
                .forEach(({ name, data }) => {
                    const animation = createAnim(data.frames, data.frameLen, data?.loop ?? true);
                    sprites.defineAnim(name, animation);
                });
        }
        return sprites;
    }

    isAnimated(sheet: SSPSpriteSheet | AnimatedSSPSpriteSheet): sheet is AnimatedSSPSpriteSheet {
        return (sheet as AnimatedSSPSpriteSheet).animations !== undefined;
    }
}
