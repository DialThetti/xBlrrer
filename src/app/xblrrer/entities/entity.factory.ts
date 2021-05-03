import { setEntityRepo } from '../../engine/entities/entity.repo';
import CrowPrefab from './prefabs/Crow.prefab';
import { BlueSlimePrefab, RedSlimePrefab } from './prefabs/slime.prefab';

const prefabs = [CrowPrefab, BlueSlimePrefab, RedSlimePrefab];
export default class EntityFactory {
    async prepare(): Promise<void> {
        const factories = await Promise.all(
            prefabs
                .map((prefabClass) => new prefabClass())
                .map(async (prefab) => ({ name: prefab.name, factory: await prefab.create() })),
        );
        setEntityRepo(factories.reduce((result, element) => ({ ...result, [element.name]: element.factory }), {}));
    }
}
