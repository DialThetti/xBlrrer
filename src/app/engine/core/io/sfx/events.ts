import { Subject } from 'projects/feather-engine-events/dist';

export class SfxEvent implements Subject<{ name: string; blocking?: boolean }> {
    topic = 'playSFX';
    constructor(public payload: { name: string; blocking?: boolean; position?: number }) {}
}
