import { EntityState } from '@dialthetti/feather-engine-entities';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import Go from '@game/entities/traits/go';
import { Context, TraitAdapter } from 'src/app/core/entities';

export default class Killable extends TraitAdapter {
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
      const g = e.getTrait(Go);

      e.vel.x = -g.facingDirection * 100;
      e.vel.y = -150;
    }
  }
}
