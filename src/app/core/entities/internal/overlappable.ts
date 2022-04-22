import { Entity } from '@dialthetti/feather-engine-entities';
import { Context, TraitAdapter } from './trait';

export interface Touchable {
    isOverlappingWith: Set<Entity>;
    onEnter: (target: Entity) => void;
    onLeave: (target: Entity) => void;
    onOver: (target: Entity) => void;
}

export class Overlappable extends TraitAdapter {
    constructor() {
        super('overlappable');
    }
    update(me: Entity & Touchable, context: Context): void {
        const overMe = new Set(me.isOverlappingWith);
        context.level.entities.forEach((target) => {
            if (target !== me) {
                if (target.bounds.overlaps(me.bounds)) {
                    //enter or already in
                    if (overMe.has(target)) {
                        //onOVer
                        me.onOver(target);
                        overMe.delete(target);
                    } else {
                        me.onEnter(target);
                    }
                }
            }
        });
        //All elements which are in overMe now are not longer overMe
        overMe.forEach((target) => me.onLeave(target));
    }
}
