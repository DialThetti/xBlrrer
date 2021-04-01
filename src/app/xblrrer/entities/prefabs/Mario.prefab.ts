import Vector from '../../../engine/math/vector';
import SpriteSheet from '../../../engine/rendering/spriteSheet';
import EntityImpl from '../entity';
import CantGoLeft from '../traits/cantGoLeft';
import Go from '../traits/go';
import Player from '../traits/player';
import Jump from '../traits/jump';
import Killable from '../traits/killable';
import Stomp from '../traits/stomp';
import EntityPrefab from '../../../engine/entities/entity.prefab';
import Solid from '../../../engine/physics/traits/solid';
import Gravity from '../../../engine/physics/traits/gravity';
import Physics from '../../../engine/physics/traits/physics';
import Trait from '../../../engine/entities/trait';
import Crouch from '../traits/crouch';

export default class MarioPrefab extends EntityPrefab {
    constructor() {
        super('mario', 'mario');
        this.size = new Vector(16, 32);
        this.offset = new Vector(8, 0);
        this.traits = (): Trait[] => [
            new Solid(),
            new Gravity(new Vector(0, 750)),
            new Physics(),
            new Jump(),
            new Go(),
            new Stomp(),
            new Killable('dead', 0),
            //    new CantGoLeft(),
            new Crouch(),
            new Player(),
        ];
    }
    entityFac = (): EntityImpl => new EntityImpl();

    routeFrame(entity: EntityImpl, sprite: SpriteSheet): string {
        const go = entity.getTrait(Go);
        const jump = entity.getTrait(Jump);
        const crouch = entity.getTrait(Crouch);
        if (crouch.down) {
            return 'crouch';
        }
        if (jump.falling) {
            if (jump.gliding) {
                return 'fall-1';
            }
            const direction = entity.vel.y < 0 ? 'jump' : 'fall';
            return sprite.getAnimation(direction)(entity.vel.y);
        }

        if (go.distance !== 0 && entity.vel.x !== 0) {
            return sprite.getAnimation('run')(go.distance);
        }
        return 'idle';
    }

    flipped(f: EntityImpl): boolean {
        const go = f.getTrait(Go);
        return go.lastDir == -1;
    }
}
