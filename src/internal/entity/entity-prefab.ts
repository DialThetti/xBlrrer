import { RenderContext, Vector } from '@dialthetti/feather-engine-core';
import { SpriteSheet, SpriteSheetLoader } from '@dialthetti/feather-engine-graphics';
import { Trait } from '../trait/trait';
import { TraitCtnr } from '../trait/trait-container';
import { Entity } from './entity';

export abstract class EntityPrefab {
    public size: Vector = new Vector(0, 0);
    public offset: Vector = new Vector(0, 0);
    public traits: () => Trait[] = () => [];

    abstract entityFac: () => Entity;
    constructor(public name: string, private spriteName?: string) {}

    abstract routeFrame(entity: Entity, sprite: SpriteSheet): string;

    flipped(entity: Entity): boolean {
        return entity.vel.x < 0;
    }

    async create(): Promise<() => Entity> {
        const sprite = this.spriteName ? await new SpriteSheetLoader(`entities/${this.spriteName}`).load() : undefined;
        return (): Entity & TraitCtnr => {
            const f = this.entityFac();
            f.size.set(this.size.x, this.size.y);
            f.offset.set(this.offset.x, this.offset.y);
            f.addTraits(this.traits());
            f.draw = (context: RenderContext): void => {
                if (!sprite) {
                    return;
                }
                const frame = this.routeFrame(f, sprite);
                if (frame) {
                    sprite.draw(frame, context, 0, 0, this.flipped(f));
                }
            };

            return f;
        };
    }
}
