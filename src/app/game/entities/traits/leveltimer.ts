import { FeatherEngine } from '@dialthetti/feather-engine-core';
import { Entity } from '@dialthetti/feather-engine-entities';
import PlatformerLevel from '@extension/platformer/level/platformer-level';
import TraitAdapter, { Context } from 'src/app/core/entities/trait';
import { PlaySFXEvent } from 'src/app/core/sfx';

export default class LevelTimer extends TraitAdapter {
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
            FeatherEngine.eventBus.publish(new PlaySFXEvent({ name: 'hurry', blocking: true }));
        }
    }

    get restTime(): number {
        return this.totalTime - this.currentTime;
    }
}
