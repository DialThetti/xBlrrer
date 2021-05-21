import Entity from '@engine/core/entities/entity';
import EventBuffer from '@engine/core/events/eventBuffer';
import Camera from '@engine/core/world/camera';
import LevelLayer from './level-layer';
import LevelTrait from './level-trait';

export default class Level {
    levelTraits: LevelTrait[] = [];

    levelLayer: LevelLayer[] = [];

    entities: Set<Entity> = new Set();

    camera: Camera;

    eventBuffer: EventBuffer = new EventBuffer();

    update(deltaTime: number): void {
        this.levelTraits.forEach((trait) => trait.update(this));
    }
}
