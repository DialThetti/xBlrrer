import Entity from '../entities/entity';
import Event from './event';

export const Names = {
    spawn: 'spawn',
    playSFX: 'playSFX',
};
export class SpawnEvent implements Event<{ entity: Entity }> {
    name = Names.spawn;
    constructor(public payload: { entity: Entity }) {}
}

export class SfxEvent implements Event<{ name: string; blocking?: boolean }> {
    name = Names.playSFX;
    constructor(public payload: { name: string; blocking?: boolean; position?: number }) {}
}
