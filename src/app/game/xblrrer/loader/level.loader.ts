import { entityRepo } from '@engine/core/entities/entity.repo';
import { EntityState } from '@engine/core/entities/entity.state';
import Loader from '@engine/core/io/loader';
import { loadImage } from '@engine/core/io/loaders';
import BoundingBox from '@engine/core/math/boundingBox';
import { addHandler } from '@engine/core/physics/collider/tile.collider';
import TileColliderLayer from '@engine/core/physics/collider/tile.collider.layer';
import Compositor from '@engine/core/rendering/compositor.layer';
import EntityLayer from '@engine/core/rendering/layers/entity.layer';
import ParallaxLayer from '@engine/core/rendering/layers/parallax.layer';
import SingleColorLayer from '@engine/core/rendering/layers/singleColor.layer';
import PlatformerEntity from '@extension/platformer/entities/platformer-entity';
import Level from '@extension/platformer/level';
import LevelSpecLoader from '@extension/platformer/loader/platformer-level.loader';
import { createBrickTileHandler } from '@extension/platformer/physics/collider/brickTile-handler';
import ChunkedTilesetLayer from '@extension/platformer/rendering/layers/chunked.tileset.layer';
import CollisionLayer from '@extension/platformer/rendering/layers/debug/collision.layer';
import EntityFactory from '../entities/entity.factory';
import { createDeatlyHandler } from '../physics/collider/deadly.handler';
import { createOnlyCrouchTileHandler } from '../physics/collider/onlyCrouch.handler';

export default class LevelLoader implements Loader<{ level: Level; player: PlatformerEntity }> {
    constructor(private levelName: string) {}

    async load(): Promise<{ level: Level; player: PlatformerEntity; renderer: Compositor; viewPorts: BoundingBox[] }> {
        const levelSpec = await new LevelSpecLoader(this.levelName).load();

        await new EntityFactory().prepare();

        const tileset = levelSpec.tiledMap.tileset;

        const level = new Level(levelSpec.tiledMap.tileSize);
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

        //   level.tiles = levelSpec.tiledMap.layers[2].matrix;
        level.startPosition = levelSpec.startPosition;
        level.estimateTime = levelSpec.estimateTime;
        level.bgm = levelSpec.bgm;
        level.collider.tileCollider.layers = levelSpec.tiledMap.layers.map(
            (layer) => new TileColliderLayer(layer, level.tilesize),
        );
        // Render Layer initialization
        const composition = new Compositor();
        composition.layers.push(new SingleColorLayer('#6B88FE'));

        if (levelSpec.parallax) {
            composition.layers.push(
                ...(await Promise.all(
                    levelSpec.parallax.map(async (a) => new ParallaxLayer(await loadImage(a.img), a.y, a.speed)),
                )),
            );
        }
        composition.layers.push(
            new ChunkedTilesetLayer(
                levelSpec.tiledMap.layers.filter((a) => a.name !== 'FRONT').map((a) => a.matrix),
                levelSpec.tiledMap.tileset,
                level.width,
                level.height,
            ),
        );
        //  composition.layers.push(new TilesetLayer(level, tileset));
        composition.layers.push(new EntityLayer(level.entities));
        //  composition.layers.push(new TilesetLayer(level, tileset, true));
        composition.layers.push(
            new ChunkedTilesetLayer(
                levelSpec.tiledMap.layers.filter((a) => a.name === 'FRONT').map((a) => a.matrix),
                levelSpec.tiledMap.tileset,
                level.width,
                level.height,
            ),
        );
        composition.layers.push(new CollisionLayer(level));
        // prepare collider
        addHandler('brick', createBrickTileHandler());
        addHandler('onlyCrouch', createOnlyCrouchTileHandler());
        addHandler('deadly', createDeatlyHandler());

        return { level, player, renderer: composition, viewPorts: levelSpec.tiledMap.viewPorts };
    }
}
