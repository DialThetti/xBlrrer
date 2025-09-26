import { ClearControlInputEvent, FeatherEngine, KeyboardInput, RenderContext } from '@dialthetti/feather-engine-core';
import { Entity, EntityState } from '@dialthetti/feather-engine-entities';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import PlatformerLevel from '@extension/platformer/level/platformer-level';
import MetroidCamera from '@extension/platformer/world/metroid-camera';
import { SavePoint } from '@game/entities/prefabs/save-point-prefab';
import { Glide, Killable, PlayerController } from '@game/entities/traits';
import { LevelRenderer } from 'src/app/core/level';
import { ResourceRegistry } from 'src/app/core/resources/resource-registry';
import { Scene, ShowSceneEvent, TRANSITION_EVENT, TransitionEvent } from 'src/app/core/scenes';
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
import { SpriteSheetLoader } from '@dialthetti/feather-engine-graphics';
export default class GameScene implements Scene {
  name = SceneNames.gameScene;
  isLoadingScene = false;
  level: PlatformerLevel;

  player: Entity;

  data?: xBlrrerSaveData;
  levelRenderer: LevelRenderer;

  constructor() {
    FeatherEngine.eventBus.subscribe(TRANSITION_EVENT, {
      receive: async (event: TransitionEvent) => {
        const saveData = FeatherEngine.getSaveDataSystem<xBlrrerSaveData>().getData();
        const p = this.level.findPlayer();
        const killable = p.getTrait(Killable);
        const { levelName, position } = event.payload;
        console.log(levelName, position);
        this.data = {
          position,
          life: killable.hp,
          stage: { name: levelName },
          collectables: { hasGliding: p.hasTrait(Glide) },
          savePoint: saveData.savePoint,
          comboSkill: 0,
        };
        FeatherEngine.eventBus.publish(
          new ShowSceneEvent({ name: SceneNames.gameScene, withLoading: true, forceLoading: true })
        );
      },
    });
  }
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
    if (this.data) {
      await this.loadLevel(this.data);
      delete this.data;
    } else {
      const saveData = FeatherEngine.getSaveDataSystem<xBlrrerSaveData>().getData();
      await this.loadLevel(saveData);
    }
  }

  async loadLevel(saveData: xBlrrerSaveData) {
    if (this.level) {
      //unload
      delete this.level;
    }
    const { level, player, renderer, viewPorts } = await new LevelLoader(saveData).load();

    const font = await ResourceRegistry.font();
    FeatherEngine.eventBus.publish(new ClearControlInputEvent());
    KeyboardInput.addKeyListener(new Input(player, level));

    const camera = new MetroidCamera(viewPorts);
    if (saveData.position) {
      level.startPosition.set(saveData.position.x / level.tilesize, saveData.position.y / level.tilesize);
    }

    const gui = await new SpriteSheetLoader('gui').load();

    const playerEnv = this.createPlayerEnv(player, level);
    player.state = EntityState.ACTIVE;
    level.entities.add(playerEnv);
    const frame = await ResourceRegistry.frame();
    renderer.push(
      new CameraLayer(camera),
      new ScrollSpyLayer(),
      new DashboardLayer(font, level, player, gui),
      new DialogLayer(font, frame, level)
      //  new RasterDebugLayer(),
    );
    level.camera = camera;
    this.level = level;
    this.levelRenderer = new LevelRenderer();
    renderer.forEach(l => this.levelRenderer.addLayer(l));
    this.player = player;

    addDebugToLevel(level);
    //Set Active Savepoint
    if (saveData.savePoint) {
      this.level.entities.forEach(e => {
        if (e.hasTrait(SavePoint) && e.pos.x == saveData.savePoint.x && e.pos.y == saveData.savePoint.y) {
          e.getTrait(SavePoint).active = true;
        }
      });
    }
  }

  update(deltaTime: number): void {
    this.level.update(deltaTime);
  }

  draw(context: RenderContext): void {
    this.levelRenderer.render(context, this.level);
  }
  async start(): Promise<void> {}
}
