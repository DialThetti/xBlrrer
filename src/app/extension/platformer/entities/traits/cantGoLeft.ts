import ATrait from '@engine/core/entities/trait';
import { Vector } from '@dialthetti/feather-engine-core';

export default class CantGoLeft extends ATrait {
    posOnScreen: Vector;
    disabledForReset = false;
    constructor() {
        super('cantGoLeft');
        this.posOnScreen = new Vector(0, 0);
    }
}
