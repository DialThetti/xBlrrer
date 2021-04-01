import { setEntityRepo } from '../../engine/entities/entity.repo';
import MarioPrefab from './prefabs/Mario.prefab';

export default class EntityFactory {
    async prepare(): Promise<void> {
        const prefabs = [MarioPrefab];
        const factories = await Promise.all(
            prefabs
                .map(prefabClass => new prefabClass())
                .map(async prefab => ({ name: prefab.name, factory: await prefab.create() })),
        );
        setEntityRepo(factories.reduce((result, element) => ({ ...result, [element.name]: element.factory }), {}));
    }
}
