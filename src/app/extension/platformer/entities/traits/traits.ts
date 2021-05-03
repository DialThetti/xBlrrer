import { Context } from '@engine/core/entities/trait';
import Level from '../../level';

export interface PlatformerTraitContext extends Context {
    level: Level;
}
