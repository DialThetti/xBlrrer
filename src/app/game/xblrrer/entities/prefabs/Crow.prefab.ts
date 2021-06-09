import EntityPrefab from '@engine/core/entities/entity.prefab';
import Trait from '@engine/core/entities/trait';
import Gravity from '@engine/core/physics/traits/gravity';
import Physics from '@engine/core/physics/traits/physics';
import Solid from '@engine/core/physics/traits/solid';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import Killable from '@extension/platformer/entities/traits/killable';
import { Vector } from 'feather-engine-core';
import { SpriteSheet } from 'feather-engine-graphics';
import Crouch from '../traits/crouch';
import Glide from '../traits/glide';
import Go from '../traits/go';
import Jump from '../traits/jump';
import Player from '../traits/player';
import Stomp from '../traits/stomp';

export default class CrowPrefab extends EntityPrefab {
    constructor() {
        super('crow', 'crow');
        this.size = new Vector(16, 32);
        this.offset = new Vector(8, 0);
        this.traits = (): Trait[] => [
            new Solid(),
            new Gravity(new Vector(0, 750)),
            new Physics(),
            new Jump(),
            new Go(),
            new Stomp(),
            new Glide(),
            new Killable('dead', 3, 0),
            new Crouch(),
            new Player(),
        ];
    }
    entityFac = (): PlatformerEntity => new PlatformerEntity();

    routeFrame(entity: PlatformerEntity, sprite: SpriteSheet): string {
        const go = entity.getTrait(Go);
        const jump = entity.getTrait(Jump);
        const crouch = entity.getTrait(Crouch);
        const glide = entity.getTrait(Glide);
        const killable = entity.getTrait(Killable);
        if (killable.invulnable) {
            if (Math.floor(killable.invulnabilityTime * 10) % 2 == 0) return '';
        }
        if (crouch.down) {
            return 'crouch';
        }
        if (glide?.gliding) {
            return 'fall-1';
        }

        if (jump.falling) {
            const direction = entity.vel.y < 0 ? 'jump' : 'fall';
            const x = sprite.getAnimation(direction)(jump.timeOfCurrentPhase);
            return x;
        }

        if (go.distance !== 0 && entity.vel.x !== 0) {
            return sprite.getAnimation('run')(go.distance);
        }
        return 'idle';
    }

    flipped(f: PlatformerEntity): boolean {
        const go = f.getTrait(Go);
        return go.facingDirection == -1;
    }
}
