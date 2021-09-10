import { TraitCtnr } from 'feather-engine-entities';
import Gravity from './gravity';
import Physics from './physics';
import Solid from './solid';

export interface Traits {
    physics: Physics;
    gravity: Gravity;
    solid: Solid;
}
export function getTraits(e: TraitCtnr): Partial<Traits> {
    return {
        physics: e.getTrait(Physics),
        gravity: e.getTrait(Gravity),
        solid: e.getTrait(Solid),
    };
}
