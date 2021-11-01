import { Loader, loadJson } from '@dialthetti/feather-engine-core';
import { TiledMap, TiledMapLoader } from '@dialthetti/feather-engine-tiled';
import PlatformerLevelData from '../model/platformer-level.interface';
import PlatformerLevel from '../model/platformer-level.model';

export default class LevelSpecLoader implements Loader<PlatformerLevelData & { tiledMap: TiledMap }> {
    constructor(private levelName: string) { }

    async load(): Promise<PlatformerLevelData & { tiledMap: TiledMap }> {
        const level = await loadJson<PlatformerLevelData>(`./levels/${this.levelName}/main.json`);

        const tiledMap = await new TiledMapLoader(level.tiledMapPath).load();

        return { ...level, tiledMap };
    }
}
