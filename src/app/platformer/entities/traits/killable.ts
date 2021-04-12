import { EntityState } from '../../../engine/entities/entity.state';
import Trait, { Context } from '../../../engine/entities/trait';
import PlatformerEntity from '../platformer-entity';

export default class Killable extends Trait {
    dead = false;
    deadTime = 0;
    constructor(public deathAnim: string = 'dead', private fadeoutTime = 2) {
        super('killable');
    }

    kill(): void {
        if (this.dead) {
            return;
        }
        this.finalize = (): void => {
            this.dead = true;
        };
    }
    revive(entity: PlatformerEntity): void {
        this.dead = false;

        this.deadTime = 0;
        entity.state = EntityState.ACTIVE;
    }
    update(entity: PlatformerEntity, context: Context): void {
        if (!this.dead) {
            return;
        }
        this.deadTime += context.deltaTime;
        if (this.fadeoutTime != -1 && this.deadTime > this.fadeoutTime) {
            entity.state = EntityState.READY_TO_REMOVE;
        }
    }
}
