import Entity from '../../../engine/entities/entity';
import Trait, { Context } from '../../../engine/entities/trait';
import Vector from '../../../engine/math/vector';
import { PositionedTile } from '../../../engine/physics/collider/tile.collider.layer';
import { Side } from '../../../engine/world/tiles/side';
import EntityImpl from '../entity';

export default class Crouch extends Trait {
    private d = false;
    memoSize: Vector;
    memoOffset: Vector;
    lockDown = false;
    requestEnd = false;
    constructor() {
        super('crouch');
    }

    obstruct(entity: Entity, side: Side, match: PositionedTile): void {}

    update(entity: EntityImpl, context: Context): void {
        if (this.d) {
            this.s(entity);
        }
        if (this.requestEnd) {
            if (!this.lockDown) this.end(entity);
        }
        this.lockDown = false;
    }

    end(entity: EntityImpl) {
        if (this.memoSize) {
            entity.pos.y -= 8;
            entity.size.set(this.memoSize.x, this.memoSize.y);
            entity.offset.set(this.memoOffset.x, this.memoOffset.y);
            this.memoSize = undefined;
            this.memoOffset = undefined;
            this.d = false;
            this.requestEnd = false;
        }
    }

    start() {
        this.d = true;
    }

    cancel() {
        this.requestEnd = true;
    }

    get down(): boolean {
        return this.d;
    }
    s(entity: Entity) {
        if (!this.memoSize) {
            this.memoSize = new Vector(entity.size.x, entity.size.y);
            this.memoOffset = new Vector(entity.offset.x, entity.offset.y);
            entity.pos.y += 8;
            entity.size.set(24, 24);
            entity.offset.set(0, 0);
        }
    }
}
