import EntityPrefab from '@engine/core/entities/entity.prefab';
import Trait from '@engine/core/entities/trait';
import SpriteSheet from '@engine/core/rendering/spriteSheet';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import { Vector } from 'feather-engine-core';

export default class LoadingPrefab extends EntityPrefab {
    constructor() {
        super('loading', 'loading');
        this.size = new Vector(32, 32);
        this.offset = new Vector(0, 0);
        this.traits = (): Trait[] => [];
    }
    entityFac = (): PlatformerEntity => new PlatformerEntity();

    routeFrame(entity: PlatformerEntity, sprite: SpriteSheet): string {
        return sprite.getAnimation('loading')(entity.lifeTime * 60);
    }
}
