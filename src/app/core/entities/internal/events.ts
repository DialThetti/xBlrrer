import { Entity } from '@dialthetti/feather-engine-entities';
import { Subject } from '@dialthetti/feather-engine-events';

export const Names = {
    spawn: 'spawn',
};
export class SpawnEvent implements Subject<{ entity: Entity }> {
    topic = Names.spawn;
    constructor(public payload: { entity: Entity }) {}
}
