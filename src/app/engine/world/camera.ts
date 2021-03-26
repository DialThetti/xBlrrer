import BoundingBox from '../math/boundingBox';
import Vector from '../math/vector';

export default class Camera {
    yAllowed = false;
    pos = new Vector(0, 0);
    size = new Vector(256 * 2, 224 * 2);
    edge = new Vector((256 * 2 - 32) / 2, 32);

    get box(): BoundingBox {
        return new BoundingBox(this.pos, this.size, new Vector(0, 0));
    }
}
