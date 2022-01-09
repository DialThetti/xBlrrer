import { Canvas, FeatherEngine, RenderContext } from '@dialthetti/feather-engine-core';
import { Level } from 'src/app/core/level';
import { RenderLayer } from 'src/app/core/rendering';

export default class ParallaxLayer implements RenderLayer {
    constructor(private img: Canvas, private y: number, private scrollSpeed = 8) { }

    draw(context: RenderContext, level: Level): void {
        const { camera } = level;
        const offset = Math.floor((-camera.box.left / this.scrollSpeed) % this.img.width);
        if (offset + this.img.width < FeatherEngine.screenSize.width) {
            context.drawImage(this.img, offset + this.img.width, this.y);
        }

        context.drawImage(this.img, offset, this.y);
    }
}
