import Camera from '../../world/camera';
import RenderLayer from './renderLayer';

export default class ParallaxLayer implements RenderLayer {
    constructor(private img: HTMLImageElement, private y: number, private scrollSpeed = 8) {}

    draw(context: CanvasRenderingContext2D, camera: Camera): void {
        const screenWidth = 256 * 2;
        const offset = Math.floor((-camera.box.left / this.scrollSpeed) % this.img.width);
        if (offset + this.img.width < screenWidth) {
            context.drawImage(this.img, offset + this.img.width, this.y);
        }

        context.drawImage(this.img, offset, this.y);
    }
}
