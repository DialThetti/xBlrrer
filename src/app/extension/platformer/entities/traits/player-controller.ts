import Trait from '@engine/core/entities/trait';
import Vector from '@engine/core/math/vector';
import Level from '../../level';
import PlatformerEntity from '../platformer-entity';
import CantGoLeft from './cantGoLeft';
import Killable from './killable';

export default class PlayerController extends Trait {
    player: PlatformerEntity;
    checkPoint: Vector;
    constructor(private level?: Level) {
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
