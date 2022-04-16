import { ClearControlInputEvent, FeatherEngine, KeyboardInput, RenderContext } from '@dialthetti/feather-engine-core';
import { Entity, EntityState } from '@dialthetti/feather-engine-entities';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import PlatformerLevel from '@extension/platformer/level/platformer-level';
import MetroidCamera from '@extension/platformer/world/metroid-camera';
import { PlayerController } from '@game/entities/traits';
import { LEVEL_RENDERER } from 'src/app/core/level';
import { ResourceRegistry } from 'src/app/core/resources/resource-registry';
import { Scene } from 'src/app/core/scenes';
import { addDebugToLevel } from '../../game/debug/debug';
import LevelTimer from '../../game/entities/traits/leveltimer';
import LevelLoader from '../../game/loader/level-loader';
import { xBlrrerSaveData } from '../../game/save-data';
import { SceneNames } from '../scene-names';
import Input from './input';
import DashboardLayer from './layer/dashboard-layer';
import CameraLayer from './layer/debug/camera-layer';
import ScrollSpyLayer from './layer/debug/scrollSpy-layer';
import DialogLayer from './layer/dialog-layer';
export default class GameScene implements Scene {
  name = SceneNames.gameScene;
  isLoadingScene = false;
  level: PlatformerLevel;

  player: Entity;

  createPlayerEnv(player: PlatformerEntity, level: PlatformerLevel): PlatformerEntity {
    const playerEnv = new PlatformerEntity();
    const playerControl = new PlayerController(level);
    const levelTimer = new LevelTimer(level);
    playerEnv.state = EntityState.ACTIVE;

    player.pos.set(level.startPosition.x * level.tilesize, level.startPosition.y * level.tilesize);
    playerControl.setPlayer(player);
    playerControl.setCheckpoint(level.startPosition);
    playerEnv.addTraits([playerControl, levelTimer]);
    return playerEnv;
  }
  async load(): Promise<void> {
    const saveData = FeatherEngine.getSaveDataSystem<xBlrrerSaveData>().getData();

    const { level, player, renderer, viewPorts } = await new LevelLoader(saveData).load();

    const font = await ResourceRegistry.font();
    FeatherEngine.eventBus.publish(new ClearControlInputEvent());
    KeyboardInput.addKeyListener(new Input(player));

    const camera = new MetroidCamera(viewPorts);
    if (saveData.position) {
      level.startPosition.set(saveData.position.x / level.tilesize, saveData.position.y / level.tilesize);
    }
    const playerEnv = this.createPlayerEnv(player, level);
    player.state = EntityState.ACTIVE;
    level.entities.add(playerEnv);
    const frame = await ResourceRegistry.frame();
    renderer.push(
      new CameraLayer(camera),
      new ScrollSpyLayer(),
      new DashboardLayer(font, level, player),
      new DialogLayer(font, frame, level)
      //  new RasterDebugLayer(),
    );
    level.camera = camera;
    this.level = level;

    renderer.forEach(l => LEVEL_RENDERER.addLayer(l));
    this.player = player;

    addDebugToLevel(level);
  }

  update(deltaTime: number): void {
    this.level.update(deltaTime);
  }

  draw(context: RenderContext): void {
    LEVEL_RENDERER.render(context, this.level);
  }
  async start(): Promise<void> {
    // resetting not required here
  }
}
