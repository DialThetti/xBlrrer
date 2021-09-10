import ATrait from '@engine/core/entities/trait';
import { PositionedTile } from '@engine/level/level-layer';
import { BoundingBox, RenderContext, Vector } from 'feather-engine-core';
import { Entity, EntityState, Side, Trait, TraitCtnr } from 'feather-engine-entities';
import { EventStack } from 'feather-engine-events';
import { PlatformerTraitContext } from './traits/traits';

export default class PlatformerEntity implements Entity, TraitCtnr {
    pos = new Vector(0, 0);
    vel = new Vector(0, 0);
    size = new Vector(16, 16);
    offset = new Vector(0, 0);
    lifeTime = 0;
    state = EntityState.ACTIVE;
    spriteChanged = false;
    bypassPlatform = false;

    bounds = new BoundingBox(this.pos, this.size, this.offset);

    traits: { [name: string]: ATrait } = {};

    standingOn: Set<string> = new Set();

    events = new EventStack();

    collide(target: Entity): void {
        this.getTraits()
            .filter((trait) => trait.enabled)
            .forEach((trait) => trait.collides(this, target));
    }

    update(context: PlatformerTraitContext): void {
        this.getTraits()
            .filter((trait) => trait.enabled)
            .forEach((trait) => trait.update(this, context));
        this.lifeTime += context.deltaTime;
        this.getTraits()
            .filter((trait) => trait.enabled)
            .filter((e) => e.finalize)
            .forEach((e) => {
                e.finalize();
                e.finalize = undefined;
            });
        this.standingOn.clear();
    }

    obstruct(side: Side, match: PositionedTile): void {
        if (side === Side.BOTTOM) {
            match.tile.types.forEach((e) => this.standingOn.add(e));
        }
        this.getTraits()
            .filter((trait) => trait.enabled)
            .forEach((trait) => trait.obstruct(this, side, match));
    }

    addTrait(trait: ATrait): void {
        this.traits[trait.name] = trait;
    }
    addTraits(traits: ATrait[]): void {
        traits.forEach((t) => this.addTrait(t));
    }

    getTrait<T extends Trait>(trait: new () => T): T {
        return this.traits[new trait().name] as any as T;
    }
    hasTrait<T extends Trait>(trait: new () => T): boolean {
        return this.traits[new trait().name] != null;
    }

    removeTraitByName(name: string): boolean {
        if (!this.traits[name]) {
            return false;
        }
        delete this.traits[name];
        return true;
    }
    draw(context: RenderContext): void {
        // entity has no rendering.
    }

    private getTraits(): ATrait[] {
        return Object.keys(this.traits).map((key) => this.traits[key]);
    }
}
