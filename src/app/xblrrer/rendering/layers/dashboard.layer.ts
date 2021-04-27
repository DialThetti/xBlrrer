import Font from '../../../engine/rendering/font';
import { drawRect } from '../../../engine/rendering/helper';
import RenderLayer from '../../../engine/rendering/layers/renderLayer';
import { SCREEN_SIZE } from '../../../engine/screen.settings';
import Level from '../../../platformer/level';

export default class DashboardLayer implements RenderLayer {
    constructor(private font: Font, private level: Level) {}

    draw(context: CanvasRenderingContext2D): void {
        drawRect(context, 0, 23 * this.level.tilesize, SCREEN_SIZE.width, 5 * this.level.tilesize, 'black', {
            filled: true,
        });
    }

    withZero(count: number, length: number): string {
        return count.toFixed().toString().padStart(length, '0');
    }
}
