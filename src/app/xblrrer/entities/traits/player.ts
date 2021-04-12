import Entity from '../../../engine/entities/entity';
import Trait from '../../../engine/entities/trait';

export default class Player extends Trait {
    lives = 3;
    private c = 0;
    score = 0;
    constructor() {
        super('player');
    }

    update(entity: Entity): void {
        entity.events.process('stomp', () => (this.score += 100));
    }

    get coins(): number {
        return this.c;
    }

    set coins(val: number) {
        if (val >= 100) {
            this.lives++;
            val -= 100;
            console.log('1-up');
        }
        this.c = val;
    }
}
