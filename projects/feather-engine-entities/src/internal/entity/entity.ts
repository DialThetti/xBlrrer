import { BoundingBox, RenderContext, Vector } from 'feather-engine-core';
import { EventStack } from 'feather-engine-events';
import { TraitCtnr } from '../trait/trait-container';
import { EntityState } from './entity-state';

export enum Side {
    TOP,
    BOTTOM,
    LEFT,
    RIGHT,
}

export interface Entity extends TraitCtnr {
    pos: Vector;
    vel: Vector;
    size: Vector;
    offset: Vector;
    bounds: BoundingBox;
    state: EntityState;
    draw(context: RenderContext): void;
    collide(target: Entity): void;
    obstruct(side: Side, cause: any): void;
    update(context: any): void;
    currentFrame?: string;
    spriteChanged: boolean;
    bypassPlatform: boolean;
    events: EventStack;
}
