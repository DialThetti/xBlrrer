import Loader from '../../engine/io/loader';
import { loadParallax } from '../../engine/io/loaders';
import ParallaxLayer from '../../engine/rendering/layers/parallax.layer';
import SingleColorLayer from '../../engine/rendering/layers/singleColor.layer';
import SpriteLayer from '../../engine/rendering/layers/sprite.layer';
import BackgroundLayer from '../rendering/layers/background.layer';
import CollisionLayer from '../rendering/layers/debug/collision.layer';
import EntityImpl from '../entities/entity';
import Level from '../world/level';
import LevelSpecLoader from './levelSpec.loader';
import TileCreator from './TileCreator';
import { EntityState } from '../../engine/entities/entity.state';
import { entityRepo } from '../../engine/entities/entity.repo';
import Compositor from '../../engine/rendering/compositor.layer';
import { createBrickTileHandler } from '../physics/collider/brickTile.handler';
import { createOnlyCrouchTileHandler } from '../physics/collider/onlyCrouch.handler';
import { addHandler } from '../../engine/physics/collider/tile.collider';
import EntityFactory from '../entities/entity.factory';
import { createCoinTileHandler } from '../physics/collider/coinTile.handler';
import TileSetLoader from '../../engine/io/tileSet.loader';
import Vector from '../../engine/math/vector';
import TileColliderLayer from '../../engine/physics/collider/tile.collider.layer';
import { TiledMapLoader } from '../../tiled/loader/tiled.map.loader';

export default class LevelLoader implements Loader<{ level: Level; player: EntityImpl }> {
    constructor(private levelName: string) {}

    async load(): Promise<{ level: Level; player: EntityImpl; renderer: Compositor }> {
        let levelSpec = await new LevelSpecLoader(this.levelName).load();
        let [backgroundSprites] = await Promise.all([
            new TileSetLoader(levelSpec.tileSet).load(),

            new EntityFactory().prepare(),
        ]);

        const tiledMap = await new TiledMapLoader('./tiled/dev.tmx').load();
        backgroundSprites = tiledMap.spriteSheet;

        const level = new Level(tiledMap.tileSize);
        level.name = this.levelName;
        const composition = new Compositor();

        composition.layers.push(new SingleColorLayer('#6B88FE'));
        if (levelSpec.entities) {
            levelSpec.entities.forEach(({ name, pos: [x, y] }) => {
                const entity = entityRepo[name]() as EntityImpl;
                entity.pos.set(x * backgroundSprites.tilesize, y * backgroundSprites.tilesize);
                //       level.entities.add(entity);
            });
        }
        const player = entityRepo['mario']() as EntityImpl;
        player.state = EntityState.ACTIVE;

        level.tiles = tiledMap.matixes[2];
        // new TileCreator(level).createTiles(levelSpec);
        level.startPosition = levelSpec.startPosition;
        level.estimateTime = levelSpec.estimateTime;
        level.bgm = levelSpec.bgm;
        level.collider.tileCollider.layers = tiledMap.matixes.map(a => new TileColliderLayer(a, level.tilesize));
        const bl = new BackgroundLayer(level, backgroundSprites);

        composition.layers.push(bl, new SpriteLayer(level.entities), new CollisionLayer(level));
        // prepare collider
        addHandler('brick', createBrickTileHandler());
        addHandler('coin', createCoinTileHandler());
        addHandler('onlyCrouch', createOnlyCrouchTileHandler());

        return { level, player, renderer: composition };
    }
}
