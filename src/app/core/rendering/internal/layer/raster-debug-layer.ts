import { RenderContext } from '@dialthetti/feather-engine-core';
import { drawRect } from '@dialthetti/feather-engine-graphics';
import { RenderLayer } from 'src/app/core/rendering';

export default class RasterDebugLayer implements RenderLayer {
  constructor(private tileSize: number = 16) {}

  draw(context: RenderContext): void {
    for (let x = 0; x < 32; x++) {
      for (let y = 0; y < 28; y++) {
        drawRect(context, x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize, '#dddddddd');
      }
    }
  }
}
