import { setEntityRepo } from '@dialthetti/feather-engine-entities';
import { GlideCollectable } from './prefabs/collectable-prefab';
import CrowPrefab from './prefabs/crow-prefab';
import { DamageArea } from './prefabs/damage-area.prefab';
import { BlueSlimePrefab, RedSlimePrefab } from './prefabs/slime-prefab';
import { SavePointPrefab } from './prefabs/save-point-prefab';

const prefabs = [CrowPrefab, BlueSlimePrefab, RedSlimePrefab, GlideCollectable, DamageArea, SavePointPrefab];
export default class EntityFactory {
  async prepare(): Promise<void> {
    const factories = await Promise.all(
      prefabs
        .map(prefabClass => new prefabClass())
        .map(async prefab => ({ name: prefab.name, factory: await prefab.create() }))
    );
    setEntityRepo(factories.reduce((result, element) => ({ ...result, [element.name]: element.factory }), {}));
  }
}
