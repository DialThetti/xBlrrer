import LevelContainer from './level';

export default interface LevelUpdater {
    update(levelContainer: LevelContainer, deltaTime: number): void;
}
