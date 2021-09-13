import ATrait, { Context } from '@engine/core/entities/trait';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import { xBlrrerSaveData } from '@game/xblrrer/scenes/platformScene/save-data';
import { FeatherEngine, Vector } from 'feather-engine-core';
import { Entity, EntityPrefab, EntityState } from 'feather-engine-entities';
import { SpriteSheet } from 'feather-engine-graphics';
import { TraitCtnr } from 'projects/feather-engine-entities/dist';
import { SfxEvent } from 'src/app/core/sfx/events';
import PlatformerLevel from '../../../../extension/platformer/level';
import Dialog from '../../rendering/dialog/Dialog';
import Glide from '../traits/glide';
class CollectableTrait extends ATrait {
    lvl: PlatformerLevel;

    constructor(private onCollect: (entity: Entity) => void) {
        super('collectableTrait');
    }
    update(entity: Entity, context: Context): void {
        this.lvl = context.level as PlatformerLevel;
    }
    collides(entity: Entity, target: Entity): void {
        target.events.publish(new SfxEvent({ name: 'collect' }));
        this.onCollect(target);
        entity.state = EntityState.READY_TO_REMOVE;
    }
}
abstract class CollectablePrefab extends EntityPrefab {
    constructor(name: string, sprite: string, onCollect: (entity: Entity & TraitCtnr) => void) {
        super(name, sprite);
        this.size = new Vector(16, 32);
        this.offset = new Vector(0, 0);
        this.traits = (): ATrait[] => [new CollectableTrait(onCollect)];
    }
    entityFac = (): Entity => new PlatformerEntity() as Entity;

    routeFrame(entity: Entity, sprite: SpriteSheet): string {
        if (entity instanceof PlatformerEntity) {
            return sprite.getAnimation('idle')(entity.lifeTime * 60);
        }
        return sprite.getAnimation('idle')(0);
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
        super('glide-collectable', 'crow_feather', (e) => {
            Dialog.show(['You have collected a crow Feather: Glide', 'Press and Hold [Space] in midair to glide']);
            e.addTraits([new Glide()]);
        });
    }

    saveDataRef(saveData: xBlrrerSaveData) {
        return saveData.collectables.hasGliding;
    }
}
