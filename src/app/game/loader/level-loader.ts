import { BoundingBox, Loader, loadImage, Vector } from '@dialthetti/feather-engine-core';
import { entityRepo, EntityState } from '@dialthetti/feather-engine-entities';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import PlatformerLevel from '@extension/platformer/level/platformer-level';
import LevelSpecLoader from '@extension/platformer/loader/platformer-level.loader';
import { createBrickTileHandler } from '@extension/platformer/physics/collider/brickTile-handler';
import ChunkedTilesetLayer from '@extension/platformer/rendering/layers/chunked.tileset.layer';
import TilesetLayer from '@extension/platformer/rendering/layers/tileset.layer';
import LevelLayer from 'src/app/core/level/level-layer';
import { addHandler } from 'src/app/core/physics/collider/tile-collider';
import { EntityLayer, ParallaxLayer, SingleColorLayer } from 'src/app/core/rendering/layer';
import RenderLayer from 'src/app/core/rendering/layer/renderLayer';
import CollisionLayer from 'src/app/scenes/platform-scene/layer/debug/collision.layer';
import EntityFactory from '../entities/entity.factory';
import Glide from '../entities/traits/glide';
import { createDeadlyHandler } from '../physics/collider/deadly.handler';
import { createOnlyCrouchTileHandler } from '../physics/collider/onlyCrouch.handler';
import { xBlrrerSaveData } from '../save-data';

export default class LevelLoader implements Loader<{ level: PlatformerLevel; player: PlatformerEntity }> {
    constructor(private saveData: xBlrrerSaveData) {}

    async load(): Promise<{
        level: PlatformerLevel;
        player: PlatformerEntity;
        renderer: RenderLayer[];
        viewPorts: BoundingBox[];
    }> {
        const levelSpec = await new LevelSpecLoader(this.saveData.stage.name).load();

        await new EntityFactory().prepare();

        const tileset = levelSpec.tiledMap.tileset;

        const level = new PlatformerLevel(levelSpec.tiledMap.tileSize);
        level.name = this.saveData.stage.name;
        level.width = levelSpec.tiledMap.width;
        level.height = levelSpec.tiledMap.height;
        if (levelSpec.tiledMap.entities) {
            levelSpec.tiledMap.entities
                .map((a) => ({ ...a, entity: entityRepo[a.prefab]() as PlatformerEntity }))
                .filter(({ entity }) => entity)
                .forEach(({ position: { x, y }, entity }) => {
                    entity.pos.set(x, y);
                    level.entities.add(entity);
                });
        }
        const player = entityRepo['crow']() as PlatformerEntity;
        if (this.saveData.collectables?.hasGliding) {
            player.addTrait(new Glide());
        }
        player.state = EntityState.ACTIVE;

        level.startPosition = new Vector(levelSpec.startPosition.x, levelSpec.startPosition.y);
        level.estimateTime = levelSpec.estimateTime;
        level.bgm = levelSpec.bgm;

        const layers: LevelLayer[] = levelSpec.tiledMap.layers.map((layer) => new LevelLayer(layer, level.tilesize));
        level.levelLayer = layers;
        // Render Layer initialization
        const composition = [];
        composition.push(new SingleColorLayer('#6B88FE'));

        if (levelSpec.parallax) {
            composition.push(
                ...(await Promise.all(
                    levelSpec.parallax.map(async (a) => new ParallaxLayer(await loadImage(a.img), a.y, a.speed)),
                )),
            );
        }
        composition.push(
            new ChunkedTilesetLayer(
                levelSpec.tiledMap.layers.filter((a) => !a.frontLayer && !a.dynamic).map((a) => a.matrix),
                levelSpec.tiledMap.tileset,
            ),

            new TilesetLayer(
                levelSpec.tiledMap.layers.filter((a) => !a.frontLayer && a.dynamic).map((a) => a.matrix),
                levelSpec.tiledMap.tileset,
                () => level.time,
            ),
            new EntityLayer(level.entities),
            new ChunkedTilesetLayer(
                levelSpec.tiledMap.layers.filter((a) => a.frontLayer && !a.dynamic).map((a) => a.matrix),
                levelSpec.tiledMap.tileset,
            ),
            new TilesetLayer(
                levelSpec.tiledMap.layers.filter((a) => a.frontLayer && a.dynamic).map((a) => a.matrix),
                levelSpec.tiledMap.tileset,
                () => level.time,
            ),
        );
        composition.push(new CollisionLayer(level));
        // prepare collider
        addHandler('brick', createBrickTileHandler());
        addHandler('onlyCrouch', createOnlyCrouchTileHandler());
        addHandler('deadly', createDeadlyHandler());

        return { level, player, renderer: composition, viewPorts: levelSpec.tiledMap.viewPorts };
    }
}
