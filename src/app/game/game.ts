import { FeatherEngine } from '@dialthetti/feather-engine-core';
import { SceneMachine, ShowSceneEvent } from 'src/app/core/scenes';
import { AudioBoardLoader, SetBgmVolumeEvent, SetMasterVolumeEvent, SetSfxVolumeEvent } from 'src/app/core/sfx';
import EngineScene from '../scenes/engine-scene/engine-scene';
import LoadingScene from '../scenes/loading-scene/loading-scene';
import MainMenuScene from '../scenes/main-menu-scene/main-menu-scene';
import MenuSettingsScene from '../scenes/menu-settings-scene/menu-settings-scene';
import GameScene from '../scenes/platform-scene/game-scene';
import { SceneNames } from '../scenes/scene-names';
import { initialData, Settings, settingsSaveSlot } from './settings';

declare const window: any; // eslint-disable-line

export default class Game {
  constructor(private canvasId: string) { }

  async start(): Promise<void> {
    const sceneMachine = new SceneMachine().addScenes([
      () => new LoadingScene(),
      () => new MainMenuScene(),
      () => new GameScene(),
      () => new MenuSettingsScene(),
            () => new EngineScene(),
        ]);
        await new AudioBoardLoader('./sfx/audio.json').load();

    this.setVolumeBySave();
    await sceneMachine.load();
    sceneMachine.start();
    FeatherEngine.eventBus.publish(
      new ShowSceneEvent({ name: SceneNames.engineScene, withLoading: true, forceLoading: true })
    );
    FeatherEngine.init({ canvasId: this.canvasId, width: 512, height: 448 });
    FeatherEngine.start();
  }

  setVolumeBySave(): void {
    const sav = FeatherEngine.getSaveDataSystem<Settings>();
    sav.clearData();
    sav.loadCurrentData(settingsSaveSlot);
    const s: Settings = { ...initialData, ...sav.getData() };
    FeatherEngine.eventBus.publish(new SetMasterVolumeEvent({ value: s.masterVolume / 10 }));
    FeatherEngine.eventBus.publish(new SetBgmVolumeEvent({ value: s.bgmVolume / 10 }));
    FeatherEngine.eventBus.publish(new SetSfxVolumeEvent({ value: s.sfxVolume / 10 }));
  }
}
