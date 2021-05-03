import Event from '@engine/core/events/event';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';

export class StompEvent implements Event<{ us: PlatformerEntity; them: PlatformerEntity }> {
    name = 'stomp';
    constructor(public payload: { us: PlatformerEntity; them: PlatformerEntity }) {}
}
