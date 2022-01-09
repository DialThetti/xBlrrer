import { Vector } from '@dialthetti/feather-engine-core';
import { Entity } from '@dialthetti/feather-engine-entities';
import { TraitAdapter } from 'src/app/core/entities';

export default class Crouch extends TraitAdapter {
    private _down = false;
    memoSize: Vector;
    memoOffset: Vector;
    lockDown = false;
    requestEnd = false;
    constructor() {
        super('crouch');
    }

    update(entity: Entity): void {
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

    end(entity: Entity): void {
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
