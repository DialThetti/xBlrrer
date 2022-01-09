import { FeatherEngine } from '@dialthetti/feather-engine-core';
import PlatformerLevel from '@extension/platformer/level/platformer-level';
import { SavePoint } from './entities/prefabs/save-point-prefab';
import { Glide, Killable } from './entities/traits';
import { xBlrrerSaveData } from './save-data';

export class SaveSystem {
    static save(l: PlatformerLevel): void {
        const p = l.findPlayer();
        const killable = p.getTrait(Killable);

        // TODO Due by Actions
        FeatherEngine.getSaveDataSystem<xBlrrerSaveData>().pushData({
            position: p.pos,
            life: killable.hp,
            stage: { name: 'forest' },
            collectables: { hasGliding: p.hasTrait(Glide) },
            savePoint: [...l.entities].find((e) => e.getTrait(SavePoint)?.active)?.pos,
        });
        FeatherEngine.getSaveDataSystem().storeCurrentData(0);
    }
}
