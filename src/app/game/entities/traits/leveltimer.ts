import { Entity } from '@dialthetti/feather-engine-entities';
import PlatformerLevel from '@extension/platformer/level/level';
import ATrait, { Context } from 'src/app/core/entities/trait';
import { SfxEvent } from 'src/app/core/sfx/events';

export default class LevelTimer extends ATrait {
    totalTime = 300;
    currentTime = 0;
    hurried = false;

    constructor(level?: PlatformerLevel) {
        super('leveltimer');
        if (level) this.totalTime = level.estimateTime;
    }
    update(entity: Entity, context: Context): void {
        this.currentTime += context.deltaTime;
        if (this.restTime <= 100 && !this.hurried) {
            this.hurried = true;
            entity.events.publish(new SfxEvent({ name: 'hurry', blocking: true }));
        }
    }

    get restTime(): number {
        return this.totalTime - this.currentTime;
    }
}
