import Vector from '../../../engine/math/vector';
import Trait from '../../../engine/entities/trait';

export default class CantGoLeft extends Trait {
    posOnScreen: Vector;
    disabledForReset = false;
    constructor() {
        super('cantGoLeft');
        this.posOnScreen = new Vector(0, 0);
    }
}
