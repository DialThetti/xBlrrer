import {
    FeatherEngine,
    KeyboardInput,
    loadImage,
    RenderContext,
    SaveDataSystem,
} from '@dialthetti/feather-engine-core';
import Level from 'src/app/core/level/level';
import Camera from 'src/app/core/rendering/camera';
import RenderLayer from 'src/app/core/rendering/layer/renderLayer';
import { ResourceRegistry } from 'src/app/core/resources/resource-registry';
import { ShowSceneEvent } from 'src/app/core/scenes/events';
import Scene from 'src/app/core/scenes/scene';
import { PlayBgmEvent, PlaySfxEvent } from 'src/app/core/sfx';
import { InitialSaveData, xBlrrerSaveData } from '../../game/save-data';
import { SceneNames } from '../scene.names';
import Input from './input';
import MainMenuLayer from './layer/main-menu-layer';

export default class MainMenuScene implements Scene {
    name = SceneNames.MainMenu;
    isLoadingScene = false;
    layers: RenderLayer[];
    _option = 0;
    camera = new Camera();
    sav: SaveDataSystem<xBlrrerSaveData>;

    private max = 3;

    async load(): Promise<void> {
        this.sav = FeatherEngine.getSaveDataSystem<xBlrrerSaveData>();
        const font = await ResourceRegistry.font();
        const title = await loadImage('./img/title.png');
        const nineway = await ResourceRegistry.frame();
        this.layers = [new MainMenuLayer(font, title, nineway, this)];
        if (!this.sav.hasData(0)) {
            this._option = 1;
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
        this.layers.forEach((layer) => layer.draw(context, { camera: this.camera } as Level));
    }

    get option(): number {
        return this._option;
    }

    set option(v: number) {
        console.log(v);
        if ((!this.sav.hasData(0) && v == 0) || v == this.max) {
            return;
        }
        this._option = (v < 0 ? v + this.max : v) % this.max;
    }

    submit(): void {
        FeatherEngine.eventBus.publish(new PlaySfxEvent({ name: 'confirm' }));
        switch (this.option) {
            case 0:
                if (this.sav.hasData(0)) {
                    this.sav.loadCurrentData(0);
                    FeatherEngine.eventBus.publish(new ShowSceneEvent({ name: SceneNames.GameScene, withLoading: true, forceLoading: true }));
                }
                break;
            case 1:
                this.sav.clearData();
                this.sav.pushData(this.newGame());
                FeatherEngine.eventBus.publish(new ShowSceneEvent({ name: SceneNames.GameScene, withLoading: true, forceLoading: true }));
                break;
            case 2:
                //Settings
                FeatherEngine.eventBus.publish(new ShowSceneEvent({ name: SceneNames.MenuSettings, withLoading: false, forceLoading: false }));
                break;
        }
    }

    newGame(): Partial<xBlrrerSaveData> {
        return InitialSaveData;
    }
}
