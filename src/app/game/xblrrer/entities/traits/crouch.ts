import Entity from '@engine/core/entities/entity';
import Trait from '@engine/core/entities/trait';
import Vector from '@engine/core/math/vector';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';

export default class Crouch extends Trait {
    private _down = false;
    memoSize: Vector;
    memoOffset: Vector;
    lockDown = false;
    requestEnd = false;
    constructor() {
        super('crouch');
    }

    update(entity: PlatformerEntity): void {
        if (this._down) {
            this.resetSize(entity);
        }
        if (this.requestEnd) {
            if (!this.lockDown) {
                this.end(entity);
            }
        }
        this.lockDown = false;
    }

    end(entity: PlatformerEntity): void {
        if (this.memoSize) {
            entity.pos.y -= 8;
            entity.size.set(this.memoSize.x, this.memoSize.y);
            entity.offset.set(this.memoOffset.x, this.memoOffset.y);
            this.memoSize = undefined;
            this.memoOffset = undefined;
        }
        this._down = false;
        this.requestEnd = true;
    }

    start(): void {
        this._down = true;
        this.requestEnd = false;
    }

    cancel(): void {
        this.requestEnd = true;
    }

    get down(): boolean {
        return this._down;
    }
    resetSize(entity: Entity): void {
        if (!this.memoSize) {
            this.memoSize = new Vector(entity.size.x, entity.size.y);
            this.memoOffset = new Vector(entity.offset.x, entity.offset.y);
            entity.pos.y += 8;
            entity.size.set(24, 24);
            entity.offset.set(0, 0);
        }
    }
}
