import { debugSettings } from '../../debug';
import Camera from '../../world/camera';
import { drawRect } from '../helper';

export default class ScrollSpyLayer {
    constructor(private tilesize = 16, private width = 32, private height = 28) {}
    draw(context: CanvasRenderingContext2D, cameraToDraw: Camera): void {
        if (!debugSettings.enabled) {
            return;
        }
        drawRect(
            context,
            cameraToDraw.edge.x,
            cameraToDraw.edge.y,
            cameraToDraw.size.x - cameraToDraw.edge.x * 2,
            cameraToDraw.size.y - cameraToDraw.edge.y * 2,
            'green',
        );
    }
}
