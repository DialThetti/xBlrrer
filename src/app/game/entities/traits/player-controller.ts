import { Vector } from '@dialthetti/feather-engine-core';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import PlatformerLevel from '@extension/platformer/level/level';
import TraitAdapter from 'src/app/core/entities/trait';
import CantGoLeft from './cantGoLeft';
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
            const cantGoLeft = this.player.getTrait(CantGoLeft);

            killable.revive(this.player);
            if (cantGoLeft) cantGoLeft.disabledForReset = true;
            this.player.pos.set(this.checkPoint.x * this.level.tilesize, this.checkPoint.y * this.level.tilesize);
            this.level.entities.add(this.player);
        }
    }
}
