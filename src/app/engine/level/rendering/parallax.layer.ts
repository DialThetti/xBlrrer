import Level from '@engine/level/level';
import RenderLayer from '@engine/level/rendering/renderLayer';
import { FeatherEngine, RenderContext } from 'feather-engine-core';

export default class ParallaxLayer implements RenderLayer {
    constructor(private img: HTMLImageElement, private y: number, private scrollSpeed = 8) {}

    draw(context: RenderContext, level: Level): void {
        const { camera } = level;
        const offset = Math.floor((-camera.box.left / this.scrollSpeed) % this.img.width);
        if (offset + this.img.width < FeatherEngine.screenSize.width) {
            context.drawImage(this.img, offset + this.img.width, this.y);
        }

        context.drawImage(this.img, offset, this.y);
    }
}
