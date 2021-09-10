import { Entity } from 'feather-engine-entities';
import { Subject } from 'feather-engine-events';

export class StompEvent implements Subject<{ us: Entity; them: Entity }> {
    topic = 'stomp';
    constructor(public payload: { us: Entity; them: Entity }) {}
}
