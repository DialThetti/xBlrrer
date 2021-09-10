import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import { Subject } from 'feather-engine-events';

export class StompEvent implements Subject<{ us: PlatformerEntity; them: PlatformerEntity }> {
    topic = 'stomp';
    constructor(public payload: { us: PlatformerEntity; them: PlatformerEntity }) {}
}
