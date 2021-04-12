import Trait from '../../../engine/entities/trait';
import Vector from '../../../engine/math/vector';

export default class CantGoLeft extends Trait {
    posOnScreen: Vector;
    disabledForReset = false;
    constructor() {
        super('cantGoLeft');
        this.posOnScreen = new Vector(0, 0);
    }
}
