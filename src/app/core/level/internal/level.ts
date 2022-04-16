import { Entity } from '@dialthetti/feather-engine-entities';
import { Camera } from 'src/app/core/rendering';
import { LevelLayer } from './level-layer';
import { LevelTrait } from './level-trait';

export class Level {
  levelTraits: LevelTrait[] = [];

  levelLayer: LevelLayer[] = [];

  entities: Set<Entity> = new Set();

  camera: Camera;

  update(deltaTime: number): void {
    this.levelTraits.forEach(trait => trait.update(this, deltaTime));
  }
}
