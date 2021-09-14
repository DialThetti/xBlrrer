import { Vector } from '@dialthetti/feather-engine-core';
import ATrait from 'src/app/core/entities/trait';

export default class CantGoLeft extends ATrait {
    posOnScreen: Vector;
    disabledForReset = false;
    constructor() {
        super('cantGoLeft');
        this.posOnScreen = new Vector(0, 0);
    }
}
