import SpriteSheetLoader from '../io/spriteSheet.loader';
import Vector from '../math/vector';
import SpriteSheet from '../rendering/spriteSheet';
import Entity from './entity';
import Trait from './trait';
import TraitCtnr from './trait.container';

export default abstract class EntityPrefab {
    public size: Vector;
    public offset: Vector;
    public traits: () => Trait[];

    abstract entityFac: () => Entity & TraitCtnr;
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
            f.draw = (context: CanvasRenderingContext2D): void => {
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
