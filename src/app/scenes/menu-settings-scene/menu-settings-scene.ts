import {
    FeatherEngine,
    KeyboardInput,
    loadImage,
    RenderContext,
    SaveDataSystem,
} from '@dialthetti/feather-engine-core';
import { initialData, Settings, settingsSaveSlot } from '@game/settings';
import { Level } from 'src/app/core/level';
import { Camera } from 'src/app/core/rendering';
import { RenderLayer } from 'src/app/core/rendering';
import { ResourceRegistry } from 'src/app/core/resources/resource-registry';
import { Scene, ShowSceneEvent } from 'src/app/core/scenes';
import { PlaySfxEvent, SetBgmVolumeEvent, SetMasterVolumeEvent, SetSfxVolumeEvent } from 'src/app/core/sfx';
import { SceneNames } from '../scene.names';
import Input from './input';
import MenuSettingsLayer from './layer/menu-settings-layer';

export default class MenuSettingsScene implements Scene {
    name = SceneNames.MenuSettings;
    isLoadingScene = false;
    layers: RenderLayer[];
    _option = 0;
    camera = new Camera();
    sav: SaveDataSystem<Settings>;

    private max = 4;

    public currentData: Settings;
    async load(): Promise<void> {
        this.sav = FeatherEngine.getSaveDataSystem<Settings>();
        const font = await ResourceRegistry.font();
        const title = await loadImage('./img/title.png');
        const nineway = await await ResourceRegistry.frame();
        this.layers = [new MenuSettingsLayer(font, title, nineway, this)];
        if (!this.sav.hasData(settingsSaveSlot)) {
            this.sav.clearData();
            this.sav.pushData(initialData);
            this.sav.storeCurrentData(settingsSaveSlot);
        }
        this.sav.loadCurrentData(settingsSaveSlot);
        this.currentData = { ...initialData, ...this.sav.getData() };
    }

    public changeSettings(dir: string): void {
        const v = dir === 'inc' ? 1 : -1;
        switch (this.option) {
            case 0:
                this.currentData.masterVolume = Math.max(0, Math.min(10, this.currentData.masterVolume + v));
                FeatherEngine.eventBus.publish(new SetMasterVolumeEvent({ value: this.currentData.masterVolume / 10 }));
                break;
            case 1:
                this.currentData.bgmVolume = Math.max(0, Math.min(10, this.currentData.bgmVolume + v));
                FeatherEngine.eventBus.publish(new SetBgmVolumeEvent({ value: this.currentData.bgmVolume / 10 }));
                break;
            case 2:
                this.currentData.sfxVolume = Math.max(0, Math.min(10, this.currentData.sfxVolume + v));
                FeatherEngine.eventBus.publish(new SetSfxVolumeEvent({ value: this.currentData.sfxVolume / 10 }));
                break;
            default:
                return;
        }
        this.updateSave();
        FeatherEngine.eventBus.publish(new PlaySfxEvent({ name: 'pointer' }));
    }

    private updateSave(): void {
        this.sav.clearData();
        this.sav.pushData(this.currentData);
        this.sav.storeCurrentData(settingsSaveSlot);
    }

    async start(): Promise<void> {
        KeyboardInput.clearKeyListeners();
        KeyboardInput.addKeyListener(new Input(this));
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
        this._option = (v < 0 ? v + this.max : v) % this.max;
    }

    submit(): void {
        FeatherEngine.eventBus.publish(new PlaySfxEvent({ name: 'confirm' }));
        this.updateSave();
        FeatherEngine.eventBus.publish(
            new ShowSceneEvent({ name: SceneNames.MainMenu, withLoading: false, forceLoading: false }),
        );
    }
}
