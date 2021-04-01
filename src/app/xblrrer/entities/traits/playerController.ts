import Trait from '../../../engine/entities/trait';
import Vector from '../../../engine/math/vector';
import PlatformerEntity from '../../../platformer/entities/platformer.entity';
import CantGoLeft from '../../../platformer/entities/traits/cantGoLeft';
import Level from '../../../platformer/level';
import Killable from './killable';

export default class PlayerController extends Trait {
    player: PlatformerEntity;
    checkPoint: Vector;
    coins = 0;
    points = 0;
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
