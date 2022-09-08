import { Vector } from '@dialthetti/feather-engine-core';
import { EntityPrefab } from '@dialthetti/feather-engine-entities';
import { SpriteSheet } from '@dialthetti/feather-engine-graphics';
import { Gravity, Physics, Solid } from 'src/app/core/physics';
import { Overlappable, TraitAdapter } from 'src/app/core/entities';
import { Attack, Crouch, Glide, Go, Jump, Killable, Player, Stomp } from '../traits';
import { TouchableEntity } from './touchable-entity';

export default class CrowPrefab extends EntityPrefab {
  constructor() {
    super('crow', 'ssp:player');
    this.size = new Vector(20, 32);
    this.offset = new Vector(32, 28);
    this.traits = (): TraitAdapter[] => [
      new Solid(),
      new Gravity(new Vector(0, 750)),
      new Physics(),
      new Jump(),
      new Go(),
      new Stomp(),
      //  new Glide(),
      new Killable('dead', 3, 0),
      new Crouch(),
      new Player(),
      //  new Attack(),
      new Overlappable(),
    ];
  }
  entityFac = (): TouchableEntity => new TouchableEntity();

  routeFrame(entity: TouchableEntity, sprite: SpriteSheet): string {
    const go = entity.getTrait(Go);
    const jump = entity.getTrait(Jump);
    const crouch = entity.getTrait(Crouch);
    const glide = entity.getTrait(Glide);
    const killable = entity.getTrait(Killable);
    const attack = entity.getTrait(Attack);
    if (killable.invulnable) {
      if (Math.floor(killable.invulnabilityTime * 10) % 2 == 0) return '';
    }
    if (crouch.active) {
      if (crouch.down && !crouch.standUpTime) {
        return sprite.getAnimation('crouch')(crouch.crouchTime * 150);
      } else {
        return sprite.getAnimation('standup')(crouch.standUpTime * 150);
      }
    }
    //   if (glide?.gliding) {
    //     return 'fall-1';
    //   }

    if (jump.falling) {
      const direction = entity.vel.y < 0 ? 'jump_start' : 'jump_mid';
      return sprite.getAnimation(direction)(jump.timeOfCurrentPhase);
    } else {
      //return 'jump_landing.png';
    }
    if (attack?.currentMove) {
      const move = attack.currentMove;
      return sprite.getAnimation(move.anim)(attack.time * 150);
    }

    if (go.distance !== 0 && entity.vel.x !== 0) {
      return sprite.getAnimation('run')(go.distance);
    }
    return sprite.getAnimation('idle')(entity.lifeTime * 150);
  }

  flipped(f: TouchableEntity): boolean {
    const go = f.getTrait(Go);
    return go.facingDirection == -1;
  }

  renderOffsetForFrame(frame: string, flipped: boolean): Vector {
    if (frame.startsWith('idle')) {
      return { x: flipped ? 0 : 22, y: 0 } as Vector;
    }
    if (frame.startsWith('run')) {
      return { x: flipped ? 0 : 22, y: 0 } as Vector;
    }
    if (frame.startsWith('slide')) {
      return { x: flipped ? 6 : 22, y: -12 } as Vector;
    }
    if (frame.startsWith('Attack')) {
      return { x: flipped ? 0 : 22, y: 0 } as Vector;
    }
    return { x: flipped ? 0 : 22, y: 0 } as Vector;
  }
}
