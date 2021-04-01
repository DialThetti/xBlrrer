import ActivateOnSight from '../../engine/entities/activateOnSight';
import TraitCtnr from '../../engine/entities/trait.container';
import CantGoLeft from './traits/cantGoLeft';
import Go from './traits/go';
import Jump from './traits/jump';
import Killable from './traits/killable';
import PlayerController from './traits/playerController';
import Stomp from './traits/stomp';
import Walk from './traits/walk.ai';
import * as physics from '../../engine/physics/traits/traits';
import Emitter from '../../engine/entities/emitter';
import { Context } from '../../engine/entities/trait';
import Level from '../world/level';
import Player from './traits/player';
import LevelTimer from './traits/leveltimer';
import Crouch from './traits/crouch';

export interface Traits extends physics.Traits {
    go: Go;
    killable: Killable;
    jump: Jump;
    stomper: Stomp;
    walk: Walk;
    cantGoLeft: CantGoLeft;
    playerController: PlayerController;
    activateOnSight: ActivateOnSight;
    emitter: Emitter;
    player: Player;
    levelTimer: LevelTimer;
    crouch: Crouch;
}

export function getTraits(e: TraitCtnr): Partial<Traits> {
    return {
        go: e.getTrait(Go),
        killable: e.getTrait(Killable),
        jump: e.getTrait(Jump),
        stomper: e.getTrait(Stomp),
        walk: e.getTrait(Walk),
        cantGoLeft: e.getTrait(CantGoLeft),
        playerController: e.getTrait(PlayerController),
        player: e.getTrait(Player),

        activateOnSight: e.getTrait(ActivateOnSight),
        emitter: e.getTrait(Emitter),
        levelTimer: e.getTrait(LevelTimer),
        crouch: e.getTrait(Crouch),
        ...physics.getTraits(e),
    };
}

export interface MarioTraitContext extends Context {
    level: Level;
}
