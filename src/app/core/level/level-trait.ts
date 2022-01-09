import Level from './level';

export interface LevelTrait {
    update(level: Level, deltaTime: number): void;
}
