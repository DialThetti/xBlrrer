import { Entity, Side } from '@dialthetti/feather-engine-entities';
import { Context, TraitAdapter } from 'src/app/core/entities';
import { Gravity } from 'src/app/core/physics';

export default class Glide extends TraitAdapter {
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

    update(entity: Entity, context: Context): void {
        const gravity = entity.getTrait(Gravity);
        if (!(this.gliding && gravity && this.enabled)) {
            return;
        }
        entity.vel.y = gravity.gravity.y * 0.95 * context.deltaTime;
    }

    obstruct(entity: Entity, side: Side): void {
        switch (side) {
            case Side.BOTTOM:
            case Side.TOP:
                this.cancel();
                break;
            default:
        }
    }
}
