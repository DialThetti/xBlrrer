import { PositionedTile } from '@engine/level/level-layer';
import EventEmitter from '../events/eventBuffer';
import BoundingBox from '../math/boundingBox';
import Vector from '../math/vector';
import { RenderContext } from '../rendering/render.utils';
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
    draw(context: RenderContext): void;
    collide(target: Entity): void;
    obstruct(side: Side, match: PositionedTile): void;
    currentFrame?: string;
    spriteChanged: boolean;
    bypassPlatform: boolean;
    events: EventEmitter;
}
