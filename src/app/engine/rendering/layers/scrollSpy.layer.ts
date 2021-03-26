import { debug } from '../../debug';
import Camera from '../../world/camera';
import { drawRect } from '../helper';

export default class ScrollSpyLayer {
    constructor(private cameraToDraw: Camera) {}
    draw(context: CanvasRenderingContext2D, fromCamera: Camera): void {
        if (!debug) {
            return;
        }
        drawRect(
            context,
            this.cameraToDraw.pos.x - fromCamera.pos.x + fromCamera.edge.x,
            this.cameraToDraw.pos.y - fromCamera.pos.y + fromCamera.edge.y,
            this.cameraToDraw.size.x - fromCamera.edge.x * 2,
            this.cameraToDraw.size.y - fromCamera.edge.y * 2,
            'green',
        );
    }
}
