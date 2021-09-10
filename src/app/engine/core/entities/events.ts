import { Subject } from 'feather-engine-events';
import Entity from './entity';

export const Names = {
    spawn: 'spawn',
    playSFX: 'playSFX',
};
export class SpawnEvent implements Subject<{ entity: Entity }> {
    topic = Names.spawn;
    constructor(public payload: { entity: Entity }) {}
}
