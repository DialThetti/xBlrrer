import { drawRect } from '../helper';
import RenderLayer from './renderLayer';

export default class SingleColorLayer implements RenderLayer {
    screenWidth = 256 * 2;
    screenHeight = 244 * 2;
    constructor(private color: string) {}

    draw(context: CanvasRenderingContext2D): void {
        drawRect(context, 0, 0, this.screenWidth, this.screenHeight, this.color, { filled: true });
    }
}
