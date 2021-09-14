import { Context } from '@engine/core/entities/trait';
import PlatformerLevel from '../../level';

export interface PlatformerTraitContext extends Context {
    level: PlatformerLevel;
}
