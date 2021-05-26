import SceneMachine from '@engine/scenes/scene-machine';
import LoadingScene from './scenes/loadingScene/loading.scene';
import MainMenuScene from './scenes/mainMenuScene/mainMenu.scene';
import GameScene from './scenes/platformScene/game.scene';

declare const window: any; // eslint-disable-line

export default class Game {
    constructor(private canvasId: string) {}

    async start(): Promise<void> {
        const sceneMachine = new SceneMachine().addScenes([
            () => new LoadingScene(),
            () => new MainMenuScene(),
            () => new GameScene('transition'),
            () => new GameScene('forest'),
        ]);
        await sceneMachine.load();
        sceneMachine.start();
        sceneMachine.setScene(MainMenuScene.NAME);
        console.log('scenes running');
    }
}
