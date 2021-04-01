import Event from '../../engine/events/event';
import EntityImpl from '../entities/entity';

export class StompEvent implements Event<{ us: EntityImpl; them: EntityImpl }> {
    name = 'stomp';
    constructor(public payload: { us: EntityImpl; them: EntityImpl }) {}
}
