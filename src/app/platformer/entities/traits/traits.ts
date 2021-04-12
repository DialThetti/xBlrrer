import { Context } from '../../../engine/entities/trait';
import Level from '../../level';

export interface PlatformerTraitContext extends Context {
    level: Level;
}
