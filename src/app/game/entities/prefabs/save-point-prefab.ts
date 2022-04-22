import { FeatherEngine, info, Vector } from '@dialthetti/feather-engine-core';
import { Entity, EntityPrefab } from '@dialthetti/feather-engine-entities';
import { SpriteSheet } from '@dialthetti/feather-engine-graphics';
import { Player } from '../traits';
import { TouchableEntity } from './touchable-entity';
import { SaveSystem } from '@game/SaveSystem';
import { Activatable, Context, Overlappable, TraitAdapter } from 'src/app/core/entities';
import PlatformerLevel from '@extension/platformer/level/platformer-level';
import { xBlrrerSaveData } from '@game/save-data';
import Dialog from '@game/rendering/dialog/dialog';

export class SavePointPrefab extends EntityPrefab {
    constructor() {
        super('save_point', 'save_point');
        this.size = new Vector(32, 16);
        this.offset = new Vector(0, 0);
        this.traits = (): TraitAdapter[] => [
            new Overlappable(),
            new Activatable((e: TouchableEntity, context: Context) => {
                info(this, 'save');
                context.level.entities.forEach((savePoint) => {
                    if (savePoint.hasTrait(SavePoint)) {
                        savePoint.getTrait(SavePoint).active = false;
                    }
                });
                e.getTrait(SavePoint).active = true;
                SaveSystem.save(context.level as PlatformerLevel);
            }),
            new SavePoint(),
        ];
    }
    entityFac = (): TouchableEntity => {
        const e = new TouchableEntity();

        return e;
    };

    flipped(): boolean {
        return false;
    }

    routeFrame(entity: TouchableEntity, sprite: SpriteSheet): string {
        if (entity.getTrait(SavePoint)?.active) {
            return sprite.getAnimation('active')(entity.lifeTime * 60);
        }
        const overlappable = entity.getTrait(Overlappable);
        if (overlappable.overLappingWithPlayer(entity)) {
            return sprite.getAnimation('highlighted')(entity.lifeTime * 60);
        }
        return sprite.getAnimation('idle')(entity.lifeTime * 60);
    }


}

export class SavePoint extends TraitAdapter {
    active = false;
    hadTutorial = false;
    constructor() {
        super('save-point');
    }

    update(entity: TouchableEntity): void {
        if (this.hadTutorial)
            return;
        const overLappable = entity.getTrait(Overlappable);
        if (overLappable.overLappingWithPlayer(entity) &&
            !FeatherEngine.getSaveDataSystem<xBlrrerSaveData>().getData().savePoint) {
            Dialog.show([
                'This is a savepoint. Press [UP] to save your process.\nWhenever you die, you will hatch on your\nlast activated savepoint.'
            ]);
            this.hadTutorial = true;
        }

    }
}
