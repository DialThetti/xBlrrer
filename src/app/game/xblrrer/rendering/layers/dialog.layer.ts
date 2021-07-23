import RenderLayer from '@engine/level/rendering/renderLayer';
import PlatformerLevel from '@extension/platformer/level';
import { FeatherEngine, RenderContext } from 'feather-engine-core';
import { drawRect, Font } from 'feather-engine-graphics';
import { Subject } from 'projects/feather-engine-events/dist';

export default class DialogLayer implements RenderLayer {
    private textToShow: string[];
    constructor(private font: Font, private level: PlatformerLevel) {
        FeatherEngine.eventBus.subscribe('dialog-text', {
            receive: (topic: string, subject: Subject) => {
                this.textToShow = subject.split('\n');
            },
        });
        FeatherEngine.eventBus.subscribe('dialog-clear', {
            receive: (topic: string, subject: Subject) => {
                this.textToShow = null;
            },
        });
    }

    draw(context: RenderContext): void {
        if (!this.textToShow) return;
        drawRect(context, 0, 23 * this.level.tilesize, FeatherEngine.screenSize.width, 5 * this.level.tilesize, 'red', {
            filled: true,
        });
        this.font.print(this.textToShow[0], context, 5, 5);
    }

    withZero(count: number, length: number): string {
        return count.toFixed().toString().padStart(length, '0');
    }
}
