import Camera from '../../world/camera';
import RenderLayer from './renderLayer';

export default class ParallaxLayer implements RenderLayer {
    scrollSpeed = 8;
    constructor(private parallax: { img: HTMLImageElement; y: number }) {}

    draw(context: CanvasRenderingContext2D, camera: Camera): void {
        const screenWidth = 256;
        const offset = (-camera.pos.x / this.scrollSpeed) % this.parallax.img.width;
        for (let index = 0; index < screenWidth; index += this.parallax.img.width) {
            context.drawImage(this.parallax.img, offset + index, -this.parallax.y);
        }
    }
}
