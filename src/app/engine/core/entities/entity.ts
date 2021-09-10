import { PositionedTile } from '@engine/level/level-layer';
import { BoundingBox, RenderContext, Vector } from 'feather-engine-core';
import { EventStack } from 'feather-engine-events';
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
    events: EventStack;
}
