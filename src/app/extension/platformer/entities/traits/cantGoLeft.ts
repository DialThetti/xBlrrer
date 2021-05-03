import Trait from '@engine/core/entities/trait';
import Vector from '@engine/core/math/vector';

export default class CantGoLeft extends Trait {
    posOnScreen: Vector;
    disabledForReset = false;
    constructor() {
        super('cantGoLeft');
        this.posOnScreen = new Vector(0, 0);
    }
}
