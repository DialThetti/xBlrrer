import { entityRepo } from './entity.repo';
import Entity from './entity';
import { EntityState } from './entity.state';
import Trait, { Context } from './trait';
import { SpawnEvent } from '../events/events';

export default class Emitter extends Trait {
    private cooldown = 0;
    direction = 1;
    constructor(
        private entityName?: string,
        private repeating: boolean = true,
        private interval = 2,
        private onEmit?: (us: Entity) => void,
    ) {
        super('emitter');
        this.cooldown = this.interval;
    }

    update(us: Entity, context: Context): void {
        if (this.enabled == false) {
            return;
        }
        this.cooldown -= context.deltaTime;
        if (this.cooldown <= 0) {
            if (this.repeating) {
                this.cooldown = this.interval;
            } else {
                this.enabled = false;
            }
            this.emit(us);
        }
    }

    emit(us: Entity): void {
        if (this.entityName) {
            const e = entityRepo[this.entityName]();
            e.vel.x = 100 * this.direction;
            e.state = EntityState.ACTIVE;
            e.pos.set(us.pos.x, us.pos.y);
            us.events.emit(new SpawnEvent({ entity: e }));
            if (this.onEmit) this.onEmit(us);
        }
    }
}
