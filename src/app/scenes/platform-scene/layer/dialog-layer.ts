import { FeatherEngine, RenderContext } from '@dialthetti/feather-engine-core';
import { Subject } from '@dialthetti/feather-engine-events';
import { Font, NineWaySpriteSheet } from '@dialthetti/feather-engine-graphics';
import PlatformerLevel from '@extension/platformer/level/platformer-level';
import { RenderLayer } from 'src/app/core/rendering';

export default class DialogLayer implements RenderLayer {
  private textToShow: string[];
  constructor(private font: Font, private frame: NineWaySpriteSheet, private level: PlatformerLevel) {
    FeatherEngine.eventBus.subscribe('dialog-text', {
      receive: (subject: Subject<string>) => {
        this.textToShow = subject.payload.split('\n');
      },
    });
    FeatherEngine.eventBus.subscribe('dialog-clear', {
      receive: () => {
        this.textToShow = null;
      },
    });
  }

  draw(context: RenderContext): void {
    if (!this.textToShow) return;
    const boxPos = { x: 2 * this.level.tilesize, y: 16 * this.level.tilesize };
    const margin = 16;

    this.frame.draw(
      context,
      boxPos.x,
      boxPos.y,
      FeatherEngine.screenSize.width - 4 * this.level.tilesize,
      5 * this.level.tilesize
    );

    this.font.print(this.textToShow[0], context, boxPos.x + margin, boxPos.y + margin);
  }

  withZero(count: number, length: number): string {
    return count.toFixed().toString().padStart(length, '0');
  }
}
