import Camera from '@engine/core/world/camera';
import { Entity } from 'feather-engine-entities';
import LevelLayer from './level-layer';
import LevelTrait from './level-trait';

export default class Level {
    levelTraits: LevelTrait[] = [];

    levelLayer: LevelLayer[] = [];

    entities: Set<Entity> = new Set();

    camera: Camera;

    update(deltaTime: number): void {
        this.levelTraits.forEach((trait) => trait.update(this));
    }
}
