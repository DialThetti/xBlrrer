import { addHandler } from '@engine/core/physics/collider/tile.collider';
import LevelLayer from '@engine/level/level-layer';
import EntityLayer from '@engine/level/rendering/entity.layer';
import ParallaxLayer from '@engine/level/rendering/parallax.layer';
import RenderLayer from '@engine/level/rendering/renderLayer';
import SingleColorLayer from '@engine/level/rendering/singleColor.layer';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import PlatformerLevel from '@extension/platformer/level';
import LevelSpecLoader from '@extension/platformer/loader/platformer-level.loader';
import { createBrickTileHandler } from '@extension/platformer/physics/collider/brickTile-handler';
import ChunkedTilesetLayer from '@extension/platformer/rendering/layers/chunked.tileset.layer';
import CollisionLayer from '@extension/platformer/rendering/layers/debug/collision.layer';
import TilesetLayer from '@extension/platformer/rendering/layers/tileset.layer';
import { BoundingBox, Loader, loadImage, Vector } from 'feather-engine-core';
import { entityRepo, EntityState } from 'feather-engine-entities';
import EntityFactory from '../entities/entity.factory';
import Glide from '../entities/traits/glide';
import { createDeadlyHandler } from '../physics/collider/deadly.handler';
import { createOnlyCrouchTileHandler } from '../physics/collider/onlyCrouch.handler';
import { xBlrrerSaveData } from '../scenes/platformScene/save-data';

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
        if (levelSpec.entities) {
            levelSpec.entities
                .map(({ name, pos: [x, y] }) => ({ name, pos: [x, y], entity: entityRepo[name]() as PlatformerEntity }))
                .filter(({ entity }) => entity)
                .forEach(({ pos: [x, y], entity }) => {
                    entity.pos.set(x * tileset.tilesize, y * tileset.tilesize);
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
