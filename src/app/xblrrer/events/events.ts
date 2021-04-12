import Event from '../../engine/events/event';
import PlatformerEntity from '../../platformer/entities/platformer-entity';

export class StompEvent implements Event<{ us: PlatformerEntity; them: PlatformerEntity }> {
    name = 'stomp';
    constructor(public payload: { us: PlatformerEntity; them: PlatformerEntity }) {}
}
