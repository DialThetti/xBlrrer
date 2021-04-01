import Vector from '../../../engine/math/vector';
import Level from '../../world/level';
import CantGoLeft from './cantGoLeft';
import Killable from './killable';
import Trait from '../../../engine/entities/trait';
import EntityImpl from '../entity';

export default class PlayerController extends Trait {
    player: EntityImpl;
    checkPoint: Vector;
    coins = 0;
    points = 0;
    constructor(private level?: Level) {
        super('playerController');
    }
    setCheckpoint(v: Vector): void {
        this.checkPoint = v;
    }
    setPlayer(player: EntityImpl): void {
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
