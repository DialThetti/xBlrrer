import { FeatherEngine, Vector } from '@dialthetti/feather-engine-core';
import { Entity, entityRepo, EntityState } from '@dialthetti/feather-engine-entities';
import { Context, SpawnEvent, TraitAdapter } from 'src/app/core/entities';
import { Damaging, TTL } from '../prefabs/damage-area.prefab';
import Go from './go';
import Jump from './jump';

interface AttackMove {
  time: number;
  anim: string;
  damageAreas: {
    size: Vector;
    offset: Vector;
  }[]
}
export class Attack extends TraitAdapter {
  enabled = true;

  isAttacking = false;
  time: 0;
  moves: AttackMove[] = [
    { time: 7, anim: 'attackA', damageAreas: [{ size: new Vector(22, 32), offset: new Vector(42, 28) }] },
    { time: 5, anim: 'attackB', damageAreas: [{ size: new Vector(32, 8), offset: new Vector(42, 28 + 14) }] },
    {
      time: 7, anim: 'attackC', damageAreas: [
        { size: new Vector(32, 32 + 28), offset: new Vector(42, 0) },
        { size: new Vector(20 + 20, 26), offset: new Vector(22, 0) },
      ]
    },
    { time: 8, anim: 'attackD', damageAreas: [{ size: new Vector(32, 32), offset: new Vector(42, 28) }] }
  ];




  nextMove = 0;
  internalCurrentMove = -1;
  facing: number = undefined;
  queueAttack = false;
  constructor(public comboSkill = 1) {
    super('attack');
  }
  update(entity: Entity, context: Context): void {
    if (this.attackPressed) {
      this.attackPressed = false;
      this.attackI(entity);
    }
    if (!this.isAttacking) {
      return;
    }
    const go = entity.getTrait(Go);
    if (go) go.facingDirection = this.facing;
    entity.vel.x = 0;

    this.time += context.deltaTime;
    if (this.time > this.currentMove.time / 15) {
      this.internalCurrentMove = -1;
      this.nextMove++;
      if (this.nextMove >= this.moves.length || this.nextMove >= this.comboSkill) {
        this.nextMove = 0;
        this.queueAttack = false;
      }
      this.endAttack();

    }
  }
  endAttack(): void {
    this.isAttacking = false;
    if (this.queueAttack) {
      this.queueAttack = false;
      this.attack();
      return;
    } else {
      this.nextMove = 0;
      this.facing = undefined;
    }

  }
  attackPressed = false;
  attack(): void {
    this.attackPressed = true;
  }
  attackI(entity: Entity): void {
    if (entity.getTrait(Jump).falling) {
      this.attackPressed = false;
      return;
    }
    if (this.isAttacking) {
      this.queueAttack = true;
      return;
    }
    this.isAttacking = true;
    this.time = 0;
    this.internalCurrentMove = this.nextMove;
    this.createDamageArea(entity, entity.pos);

  }

  get currentMove(): AttackMove | null {
    return this.internalCurrentMove !== -1 ? this.moves[this.internalCurrentMove] : null;
  }

  createDamageArea(entity: Entity, position: Vector): void {
    const entitySet = new Set<Entity>();

    //attack will not hit the creator
    entitySet.add(entity);
    this.currentMove.damageAreas.forEach(area => {
      const e = entityRepo['damage-area']();
      if (e.getTrait(Damaging)) e.getTrait(Damaging).targetedEntitySet = entitySet;
      e.getTrait(TTL).time = this.currentMove.time / 15;
      e.state = EntityState.ACTIVE;
      e.pos.set(position.x + 10, position.y);

      this.facing = entity.getTrait(Go)?.facingDirection;

      e.offset.set(this.facing !== -1 ? area.offset.x : 0, area.offset.y);
      e.size.set(area.size.x, area.size.y);
      entity.events.publish(new SpawnEvent({ entity: e }));
    });

  }
}
