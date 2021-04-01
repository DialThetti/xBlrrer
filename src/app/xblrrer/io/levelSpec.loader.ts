import Loader from '../../engine/io/loader';
import { loadJson } from '../../engine/io/loaders';
import LevelSpec, { PatternSpec } from '../../model/LevelSpec';

export default class LevelSpecLoader implements Loader<LevelSpec> {
    constructor(private levelName: string) {}

    async load(): Promise<LevelSpec> {
        const [level, pattern] = await Promise.all([
            loadJson<LevelSpec>(`./levels/${this.levelName}.json`),
            loadJson<PatternSpec>('./levels/1-1.patterns.json'),
        ]);
        level.patterns = pattern;
        return level;
    }
}
