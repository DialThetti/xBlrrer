import EventEmitter from '../events/eventBuffer';
import BoundingBox from '../math/boundingBox';
import Vector from '../math/vector';
import { PositionedTile } from '../physics/collider/tile.collider.layer';
import { Side } from '../world/tiles/side';
import { EntityState } from './entity.state';
import TraitCtnr from './trait.container';

export default interface Entity extends TraitCtnr {
    pos: Vector;
    vel: Vector;
    size: Vector;
    offset: Vector;
    bounds: BoundingBox;
    state: EntityState;
    draw(context: CanvasRenderingContext2D): void;
    collide(target: Entity): void;
    obstruct(side: Side, match: PositionedTile): void;
    currentFrame?: string;
    spriteChanged: boolean;
    bypassPlatform: boolean;
    events: EventEmitter;
}
