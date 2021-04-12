import EntityPrefab from '../../../engine/entities/entity.prefab';
import Trait from '../../../engine/entities/trait';
import Vector from '../../../engine/math/vector';
import Gravity from '../../../engine/physics/traits/gravity';
import Physics from '../../../engine/physics/traits/physics';
import Solid from '../../../engine/physics/traits/solid';
import SpriteSheet from '../../../engine/rendering/spriteSheet';
import PlatformerEntity from '../../../platformer/entities/platformer-entity';
import Killable from '../../../platformer/entities/traits/killable';
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
            new Killable('dead', 0),
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

        if (crouch.down) {
            return 'crouch';
        }
        if (glide?.gliding) {
            return 'fall-1';
        }
        if (jump.falling) {
            const direction = entity.vel.y < 0 ? 'jump' : 'fall';
            return sprite.getAnimation(direction)(entity.vel.y);
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
