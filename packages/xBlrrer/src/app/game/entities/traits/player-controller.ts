import { Vector } from '@dialthetti/feather-engine-core';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import PlatformerLevel from '@extension/platformer/level/platformer-level';
import { TraitAdapter } from 'src/app/core/entities';
import Killable from './killable';

export default class PlayerController extends TraitAdapter {
  player: PlatformerEntity;
  checkPoint: Vector;
  constructor(private level?: PlatformerLevel) {
    super('playerController');
  }
  setCheckpoint(v: Vector): void {
    this.checkPoint = v;
  }
  setPlayer(player: PlatformerEntity): void {
    this.player = player;
  }

  update(): void {
    if (!this.level.entities.has(this.player)) {
      const killable = this.player.getTrait(Killable);
      killable.revive(this.player);
      this.player.pos.set(this.checkPoint.x * this.level.tilesize, this.checkPoint.y * this.level.tilesize);
      this.level.entities.add(this.player);
    }
  }
}
