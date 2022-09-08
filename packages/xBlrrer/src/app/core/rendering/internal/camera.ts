import { BoundingBox, FeatherEngine, Vector } from '@dialthetti/feather-engine-core';
import { Entity } from '@dialthetti/feather-engine-entities';

export class Camera {
  protected pos = new Vector(0, 0);

  edge = new Vector((256 * 2 - 32) / 2, 64);

  constructor(
    private totalMovementBounds = new BoundingBox(
      new Vector(0, 0),
      new Vector(FeatherEngine.screenSize.width, FeatherEngine.screenSize.height)
    ),
    public size = new Vector(FeatherEngine.screenSize.width, 23 * 16)
  ) {
    this.pos.set(totalMovementBounds.left, totalMovementBounds.top);
  }
  public get box(): BoundingBox {
    return new BoundingBox(this.pos, this.size);
  }

  get viewPort(): BoundingBox {
    return this.totalMovementBounds;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(playerFigure: Entity, dT: number): void {
    const right = playerFigure.bounds.right - this.box.right + this.edge.x;
    const left = playerFigure.bounds.left - this.box.left - this.edge.x;
    this.pos.x += Math.max(right, Math.min(left, 0));

    // if backward is allowed
    const bottom = playerFigure.bounds.bottom - this.box.bottom + this.edge.y;
    const top = playerFigure.bounds.top - this.box.top - this.edge.y;
    this.pos.y += Math.max(bottom, Math.min(top, 0));

    this.pos.set(
      Math.floor(
        Math.max(this.totalMovementBounds.left, Math.min(this.totalMovementBounds.right - this.size.x, this.pos.x))
      ),
      Math.floor(
        Math.max(this.totalMovementBounds.top, Math.min(this.totalMovementBounds.bottom - this.size.y, this.pos.y))
      )
    );
  }
}
