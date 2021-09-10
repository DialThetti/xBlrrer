import ATrait, { Context } from '@engine/core/entities/trait';
import Go from '@game/xblrrer/entities/traits/go';
import { EntityState } from 'feather-engine-entities';
import PlatformerEntity from '../platformer-entity';

export default class Killable extends ATrait {
    dead = false;
    deadTime = 0;
    invulnabilityTime = 0;
    hp = 1;

    constructor(public deathAnim: string = 'dead', public maxHP = 1, private fadeoutTime = 2) {
        super('killable');
        this.hp = maxHP;
    }

    kill(damage = 1): void {
        if (this.invulnable) {
            return;
        }
        if (this.dead) {
            return;
        }
        this.hp -= damage;
        this.invulnabilityTime = 1;
        if (this.hp <= 0) {
            this.finalize = (): void => {
                this.dead = true;
            };
        } else {
        }
    }
    revive(entity: PlatformerEntity): void {
        this.dead = false;
        this.hp = this.maxHP;
        this.invulnabilityTime = 0;
        this.deadTime = 0;
        entity.state = EntityState.ACTIVE;
    }
    update(entity: PlatformerEntity, context: Context): void {
        this.invulnabilityTime -= context.deltaTime;
        if (this.invulnabilityTime <= 0) {
            this.invulnabilityTime = 0;
        } else if (this.invulnabilityTime > 0.8) {
            this.repulse(entity);
        }
        if (!this.dead) {
            return;
        }

        this.deadTime += context.deltaTime;
        if (this.fadeoutTime != -1 && this.deadTime > this.fadeoutTime) {
            entity.state = EntityState.READY_TO_REMOVE;
        }
    }

    get invulnable(): boolean {
        return this.invulnabilityTime > 0;
    }

    repulse(e: PlatformerEntity): void {
        if (e.hasTrait(Go)) {
            console.log('repulsing');
            debugger;
            const g = e.getTrait(Go);

            e.vel.x = -g.facingDirection * 100;
            e.vel.y = -150;
        }
    }
}
