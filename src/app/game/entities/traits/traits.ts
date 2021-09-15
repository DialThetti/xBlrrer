import PlatformerLevel from '@extension/platformer/level/platformer-level';
import { Context } from 'src/app/core/entities/trait';

export interface PlatformerTraitContext extends Context {
    level: PlatformerLevel;
}
