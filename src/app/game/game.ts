import { FeatherEngine } from '@dialthetti/feather-engine-core';
import SceneMachine from 'src/app/core/scenes/scene-machine';
import { AudioBoard, AudioBoardLoader } from '../core/sfx';
import LoadingScene from '../scenes/loading-scene/loading-scene';
import MainMenuScene from '../scenes/main-menu-scene/main-menu-scene';
import MenuSettingsScene from '../scenes/menu-settings-scene/menu-settings-scene';
import GameScene from '../scenes/platform-scene/game-scene';
import { initialData, Settings, settingsSaveSlot } from './settings';

declare const window: any; // eslint-disable-line

export default class Game {
    constructor(private canvasId: string) {}

    async start(): Promise<void> {
        const sceneMachine = new SceneMachine().addScenes([
            () => new LoadingScene(),
            () => new MainMenuScene(),
            () => new GameScene(),
            () => new MenuSettingsScene(),
        ]);
        const audioBoard = await new AudioBoardLoader('./sfx/audio.json').load();

        this.setVolumeBySave(audioBoard);
        await sceneMachine.load();
        sceneMachine.start();
        sceneMachine.setScene(MainMenuScene.NAME);
    }

    setVolumeBySave(audioBoard: AudioBoard): void {
        const sav = FeatherEngine.getSaveDataSystem<Settings>();
        sav.clearData();
        sav.loadCurrentData(settingsSaveSlot);
        const s: Settings = { ...initialData, ...sav.getData() };
        audioBoard.setMasterVolume(s.masterVolume / 10);
        audioBoard.setBgmVolume(s.bgmVolume / 10);
        audioBoard.setSfxVolume(s.sfxVolume / 10);
    }
}
