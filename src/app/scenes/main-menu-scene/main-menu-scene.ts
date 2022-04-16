import {
  FeatherEngine,
  KeyboardInput,
  loadImage,
  RenderContext,
  SaveDataSystem,
} from '@dialthetti/feather-engine-core';
import { Level } from 'src/app/core/level';
import { Camera } from 'src/app/core/rendering';
import { RenderLayer } from 'src/app/core/rendering';
import { ResourceRegistry } from 'src/app/core/resources/resource-registry';
import { Scene, ShowSceneEvent } from 'src/app/core/scenes';
import { PlayBgmEvent, PlaySfxEvent } from 'src/app/core/sfx';
import { InitialSaveData, xBlrrerSaveData } from '../../game/save-data';
import { SceneNames } from '../scene-names';
import Input from './input';
import MainMenuLayer from './layer/main-menu-layer';

export default class MainMenuScene implements Scene {
  name = SceneNames.mainMenu;
  isLoadingScene = false;
  layers: RenderLayer[];
  camera = new Camera();
  sav: SaveDataSystem<xBlrrerSaveData>;

  private internalOption = 0;
  private max = 3;

  async load(): Promise<void> {
    this.sav = FeatherEngine.getSaveDataSystem<xBlrrerSaveData>();
    const font = await ResourceRegistry.font();
    const title = await loadImage('./img/title.png');
    const nineway = await ResourceRegistry.frame();
    this.layers = [new MainMenuLayer(font, title, nineway, this)];
    if (!this.sav.hasData(0)) {
      this.internalOption = 1;
    }
  }

  async start(): Promise<void> {
    KeyboardInput.addKeyListener(new Input(this));
    FeatherEngine.eventBus.publish(new PlayBgmEvent({ name: 'menu' }));
  }

  update(): void {
    //nothing on update atm
  }
  draw(context: RenderContext): void {
    this.layers.forEach(layer => layer.draw(context, { camera: this.camera } as Level));
  }

  get option(): number {
    return this.internalOption;
  }

  set option(v: number) {
    if ((!this.sav.hasData(0) && v == 0) || v == this.max) {
      return;
    }
    this.internalOption = (v < 0 ? v + this.max : v) % this.max;
  }

  submit(): void {
    FeatherEngine.eventBus.publish(new PlaySfxEvent({ name: 'confirm' }));
    switch (this.option) {
      case 0:
        if (this.sav.hasData(0)) {
          this.sav.loadCurrentData(0);
          FeatherEngine.eventBus.publish(
            new ShowSceneEvent({ name: SceneNames.gameScene, withLoading: true, forceLoading: true })
          );
        }
        break;
      case 1:
        this.sav.clearData();
        this.sav.pushData(this.newGame());
        FeatherEngine.eventBus.publish(
          new ShowSceneEvent({ name: SceneNames.gameScene, withLoading: true, forceLoading: true })
        );
        break;
      case 2:
        //Settings
        FeatherEngine.eventBus.publish(
          new ShowSceneEvent({ name: SceneNames.menuSettings, withLoading: false, forceLoading: false })
        );
        break;
    }
  }

  newGame(): Partial<xBlrrerSaveData> {
    return InitialSaveData;
  }
}
