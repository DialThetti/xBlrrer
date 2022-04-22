import { RenderContext, Vector } from '@dialthetti/feather-engine-core';
import { SpriteSheet, SpriteSheetLoader ,SSPSpritesheetLoader} from '@dialthetti/feather-engine-graphics';
import { Trait } from '../trait/trait';
import { TraitCtnr } from '../trait/trait-container';
import { Entity } from './entity';

export abstract class EntityPrefab {
    public size: Vector = new Vector(0, 0);
    public offset: Vector = new Vector(0, 0);
    public traits: () => Trait[] = () => [];

    abstract entityFac: () => Entity;
    constructor(public name: string, private spriteName?: string) { }

    abstract routeFrame(entity: Entity, sprite: SpriteSheet): string;

    flipped(entity: Entity): boolean {
        return entity.vel.x < 0;
    }

    async create(): Promise<() => Entity> {
        const sprite = await this.getSprite();

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
                    const flipped = this.flipped(f);
                    const of = this.renderOffsetForFrame(frame,flipped);
                    sprite.draw(frame, context, of.x, of.y, flipped);
                    
                }
            };

            return f;
        };
    }

    async getSprite(): Promise<SpriteSheet | undefined> {
        if (this.spriteName?.startsWith('ssp:')) {
            const sprite = this.spriteName ? await new SSPSpritesheetLoader('sprites', `${this.spriteName.replace('ssp:','')}`).load() : undefined;
            return sprite;
        } else {
            const sprite = this.spriteName ? await new SpriteSheetLoader(`entities/${this.spriteName}`).load() : undefined;
            return sprite;
        }
    }

    renderOffsetForFrame(frame:string,flipped:boolean):Vector{
        return new Vector(0,0);
    }
}
