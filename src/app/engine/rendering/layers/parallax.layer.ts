import Camera from '../../world/camera';
import RenderLayer from './renderLayer';

export default class ParallaxLayer implements RenderLayer {
    constructor(private parallax: { img: HTMLImageElement; y: number }, private scrollSpeed = 8) {}

    draw(context: CanvasRenderingContext2D, camera: Camera): void {
        const screenWidth = 256 * 2;
        const offset = Math.floor((-camera.pos.x / this.scrollSpeed) % this.parallax.img.width);
        for (let index = 0; index < screenWidth; index += this.parallax.img.width) {
            context.drawImage(this.parallax.img, offset + index, -this.parallax.y);
        }
    }
}
