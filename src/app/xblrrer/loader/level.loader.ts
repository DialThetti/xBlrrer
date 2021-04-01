import { entityRepo } from '../../engine/entities/entity.repo';
import { EntityState } from '../../engine/entities/entity.state';
import Loader from '../../engine/io/loader';
import { addHandler } from '../../engine/physics/collider/tile.collider';
import TileColliderLayer from '../../engine/physics/collider/tile.collider.layer';
import Compositor from '../../engine/rendering/compositor.layer';
import SingleColorLayer from '../../engine/rendering/layers/singleColor.layer';
import SpriteLayer from '../../engine/rendering/layers/sprite.layer';
import PlatformerEntity from '../../platformer/entities/platformer.entity';
import Level from '../../platformer/level';
import LevelSpecLoader from '../../platformer/loader/platformer.level.loader';
import { createBrickTileHandler } from '../../platformer/physics/collider/brickTile.handler';
import { createCoinTileHandler } from '../../platformer/physics/collider/coinTile.handler';
import BackgroundLayer from '../../platformer/rendering/layers/background.layer';
import EntityFactory from '../entities/entity.factory';
import { createOnlyCrouchTileHandler } from '../physics/collider/onlyCrouch.handler';
import CollisionLayer from '../rendering/layers/debug/collision.layer';

export default class LevelLoader implements Loader<{ level: Level; player: PlatformerEntity }> {
    constructor(private levelName: string) {}

    async load(): Promise<{ level: Level; player: PlatformerEntity; renderer: Compositor }> {
        const levelSpec = await new LevelSpecLoader(this.levelName).load();

        await new EntityFactory().prepare();

        const backgroundSprites = levelSpec.tiledMap.spriteSheet;

        const level = new Level(levelSpec.tiledMap.tileSize);
        level.name = this.levelName;
        const composition = new Compositor();

        composition.layers.push(new SingleColorLayer('#6B88FE'));
        if (levelSpec.entities) {
            levelSpec.entities.forEach(({ name, pos: [x, y] }) => {
                const entity = entityRepo[name]() as PlatformerEntity;
                entity.pos.set(x * backgroundSprites.tilesize, y * backgroundSprites.tilesize);
                //       level.entities.add(entity);
            });
        }
        const player = entityRepo['mario']() as PlatformerEntity;
        player.state = EntityState.ACTIVE;

        level.tiles = levelSpec.tiledMap.matixes[2];
        // new TileCreator(level).createTiles(levelSpec);
        level.startPosition = levelSpec.startPosition;
        level.estimateTime = levelSpec.estimateTime;
        level.bgm = levelSpec.bgm;
        level.collider.tileCollider.layers = levelSpec.tiledMap.matixes.map(
            (a) => new TileColliderLayer(a, level.tilesize),
        );
        const bl = new BackgroundLayer(level, backgroundSprites);

        composition.layers.push(bl, new SpriteLayer(level.entities), new CollisionLayer(level));
        // prepare collider
        addHandler('brick', createBrickTileHandler());
        addHandler('coin', createCoinTileHandler());
        addHandler('onlyCrouch', createOnlyCrouchTileHandler());

        return { level, player, renderer: composition };
    }
}
