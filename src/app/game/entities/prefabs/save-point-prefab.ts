import { info, Vector } from '@dialthetti/feather-engine-core';
import { EntityPrefab } from '@dialthetti/feather-engine-entities';
import { SpriteSheet } from '@dialthetti/feather-engine-graphics';
import { Player } from '../traits';
import { TouchableEntity } from './touchable-entity';
import { SaveSystem } from '@game/SaveSystem';
import { Activatable, Context, Overlappable, TraitAdapter } from 'src/app/core/entities';
import PlatformerLevel from '@extension/platformer/level/platformer-level';

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
        if (this.overLappingWithPlayer(entity)) {
            return sprite.getAnimation('highlighted')(entity.lifeTime * 60);
        }
        return sprite.getAnimation('idle')(entity.lifeTime * 60);
    }

    overLappingWithPlayer(ov: TouchableEntity): boolean {
        return [...ov.isOverlappingWith].some((e) => e.hasTrait(Player));
    }
}

export class SavePoint extends TraitAdapter {
    active = false;
    constructor() {
        super('save-point');
    }
}
