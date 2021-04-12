import Entity from '../../../engine/entities/entity';
import Trait, { Context } from '../../../engine/entities/trait';
import { SfxEvent } from '../../../engine/events/events';
import Level from '../../../platformer/level';

export default class LevelTimer extends Trait {
    totalTime = 300;
    currentTime = 0;
    hurried = false;

    constructor(level?: Level) {
        super('leveltimer');
        if (level) this.totalTime = level.estimateTime;
    }
    update(entity: Entity, context: Context): void {
        this.currentTime += context.deltaTime;
        if (this.restTime <= 100 && !this.hurried) {
            this.hurried = true;
            entity.events.emit(new SfxEvent({ name: 'hurry', blocking: true }));
        }
    }

    get restTime(): number {
        return this.totalTime - this.currentTime;
    }
}
