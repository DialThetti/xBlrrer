import { entityRepo } from '@engine/core/entities/entity.repo';
import { EntityState } from '@engine/core/entities/entity.state';
import { addHandler } from '@engine/core/physics/collider/tile.collider';
import TileColliderLayer from '@engine/core/physics/collider/tile.collider.layer';
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
import { BoundingBox, Loader, loadImage } from 'feather-engine-core';
import EntityFactory from '../entities/entity.factory';
import { createDeatlyHandler } from '../physics/collider/deadly.handler';
import { createOnlyCrouchTileHandler } from '../physics/collider/onlyCrouch.handler';

export default class LevelLoader implements Loader<{ level: PlatformerLevel; player: PlatformerEntity }> {
    constructor(private levelName: string) {}

    async load(): Promise<{
        level: PlatformerLevel;
        player: PlatformerEntity;
        renderer: RenderLayer[];
        viewPorts: BoundingBox[];
    }> {
        const levelSpec = await new LevelSpecLoader(this.levelName).load();

        await new EntityFactory().prepare();

        const tileset = levelSpec.tiledMap.tileset;

        const level = new PlatformerLevel(levelSpec.tiledMap.tileSize);
        level.name = this.levelName;
        level.width = levelSpec.tiledMap.width;
        level.height = levelSpec.tiledMap.height;
        if (levelSpec.entities) {
            levelSpec.entities.forEach(({ name, pos: [x, y] }) => {
                const entity = entityRepo[name]() as PlatformerEntity;

                entity.pos.set(x * tileset.tilesize, y * tileset.tilesize);
                level.entities.add(entity);
            });
        }
        console.log(Object.keys(entityRepo));
        const player = entityRepo['crow']() as PlatformerEntity;
        player.state = EntityState.ACTIVE;

        level.startPosition = levelSpec.startPosition;
        level.estimateTime = levelSpec.estimateTime;
        level.bgm = levelSpec.bgm;

        const layers: TileColliderLayer[] = levelSpec.tiledMap.layers.map(
            (layer) => new TileColliderLayer(layer, level.tilesize),
        );
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
                levelSpec.tiledMap.layers.filter((a) => a.name !== 'FRONT').map((a) => a.matrix),
                levelSpec.tiledMap.tileset,
            ),
        );
        composition.push(new EntityLayer(level.entities));
        composition.push(
            new ChunkedTilesetLayer(
                levelSpec.tiledMap.layers.filter((a) => a.name === 'FRONT').map((a) => a.matrix),
                levelSpec.tiledMap.tileset,
            ),
        );
        composition.push(new CollisionLayer(level));
        // prepare collider
        addHandler('brick', createBrickTileHandler());
        addHandler('onlyCrouch', createOnlyCrouchTileHandler());
        addHandler('deadly', createDeatlyHandler());

        return { level, player, renderer: composition, viewPorts: levelSpec.tiledMap.viewPorts };
    }
}
