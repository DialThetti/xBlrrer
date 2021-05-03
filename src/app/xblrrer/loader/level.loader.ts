import { entityRepo } from '../../engine/entities/entity.repo';
import { EntityState } from '../../engine/entities/entity.state';
import Loader from '../../engine/io/loader';
import { loadImage } from '../../engine/io/loaders';
import BoundingBox from '../../engine/math/boundingBox';
import { addHandler } from '../../engine/physics/collider/tile.collider';
import TileColliderLayer from '../../engine/physics/collider/tile.collider.layer';
import Compositor from '../../engine/rendering/compositor.layer';
import EntityLayer from '../../engine/rendering/layers/entity.layer';
import ParallaxLayer from '../../engine/rendering/layers/parallax.layer';
import SingleColorLayer from '../../engine/rendering/layers/singleColor.layer';
import PlatformerEntity from '../../platformer/entities/platformer-entity';
import Level from '../../platformer/level';
import LevelSpecLoader from '../../platformer/loader/platformer-level.loader';
import { createBrickTileHandler } from '../../platformer/physics/collider/brickTile-handler';
import ChunkedTilesetLayer from '../../platformer/rendering/layers/chunked.tileset.layer';
import CollisionLayer from '../../platformer/rendering/layers/debug/collision.layer';
import EntityFactory from '../entities/entity.factory';
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
                for (let index = 0; index < 10; index++) {
                    const entity = entityRepo[name]() as PlatformerEntity;

                    entity.pos.set(x * tileset.tilesize, y * tileset.tilesize);
                    level.entities.add(entity);
                }
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

        composition.layers.push(
            ...(await Promise.all(
                levelSpec.parallax?.map(async (a) => new ParallaxLayer(await loadImage(a.img), a.y, a.speed)),
            )),
        );
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

        return { level, player, renderer: composition, viewPorts: levelSpec.tiledMap.viewPorts };
    }
}
