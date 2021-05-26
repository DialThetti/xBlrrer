import Trait, { Context } from '@engine/core/entities/trait';
import Gravity from '@engine/core/physics/traits/gravity';
import { Side } from '@engine/core/world/tiles/side';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';

export default class Glide extends Trait {
    gliding = false;

    constructor() {
        super('glide');
    }

    start(): void {
        this.gliding = true;
    }
    cancel(): void {
        this.gliding = false;
    }

    update(entity: PlatformerEntity, context: Context): void {
        const gravity = entity.getTrait(Gravity);
        if (!(this.gliding && gravity && this.enabled)) {
            return;
        }
        entity.vel.y = gravity.gravity.y * 0.95 * context.deltaTime;
    }

    obstruct(entity: PlatformerEntity, side: Side): void {
        switch (side) {
            case Side.BOTTOM:
            case Side.TOP:
                this.cancel();
                break;
            default:
        }
    }
}
