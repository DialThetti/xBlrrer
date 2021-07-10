import EntityPrefab from '@engine/core/entities/entity.prefab';
import { EntityState } from '@engine/core/entities/entity.state';
import Trait from '@engine/core/entities/trait';
import { SfxEvent } from '@engine/core/events/events';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import { xBlrrerSaveData } from '@game/xblrrer/scenes/platformScene/save-data';
import { FeatherEngine, Vector } from 'feather-engine-core';
import { SpriteSheet } from 'feather-engine-graphics';
import Glide from '../traits/glide';

class CollectableTrait extends Trait {
    constructor(private onCollect: (entity: PlatformerEntity) => void) {
        super('collectableTrait');
    }

    collides(entity: PlatformerEntity, target: PlatformerEntity): void {
        this.onCollect(target);
        target.events.emit(new SfxEvent({ name: 'collect' }));
        entity.state = EntityState.READY_TO_REMOVE;
    }
}
abstract class CollectablePrefab extends EntityPrefab {
    constructor(name: string, sprite: string, onCollect: (entity: PlatformerEntity) => void) {
        super(name, sprite);
        this.size = new Vector(16, 32);
        this.offset = new Vector(0, 0);
        this.traits = (): Trait[] => [new CollectableTrait(onCollect)];
    }
    entityFac = (): PlatformerEntity => new PlatformerEntity();

    routeFrame(entity: PlatformerEntity, sprite: SpriteSheet): string {
        return sprite.getAnimation('idle')(entity.lifeTime * 60);
    }

    abstract saveDataRef(saveData: xBlrrerSaveData): boolean;

    async create() {
        const sav = FeatherEngine.getSaveDataSystem<xBlrrerSaveData>();
        const data = sav.getData();
        if (this.saveDataRef(data)) return () => null;
        return super.create();
    }
}

export class GlideCollectable extends CollectablePrefab {
    constructor() {
        super('glide-collectable', 'crow_feather', (e) => e.addTrait(new Glide()));
    }

    saveDataRef(saveData: xBlrrerSaveData) {
        return saveData.collectables.hasGliding;
    }
}
