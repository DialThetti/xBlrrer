import Camera from '../../world/camera';
import RenderLayer from './renderLayer';

export default class ParallaxLayer implements RenderLayer {
    constructor(private img: HTMLImageElement, private scrollSpeed = 8) {}

    draw(context: CanvasRenderingContext2D, camera: Camera): void {
        const screenWidth = 256 * 2;
        const offset = Math.floor((-camera.pos.x / this.scrollSpeed) % this.img.width);
        for (let index = 0; index < screenWidth; index += this.img.width) {
            context.drawImage(this.img, offset + index, 0);
        }
    }
}
