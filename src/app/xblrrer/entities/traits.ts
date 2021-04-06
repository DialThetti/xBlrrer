import ActivateOnSight from '../../engine/entities/activateOnSight';
import Emitter from '../../engine/entities/emitter';
import TraitCtnr from '../../engine/entities/trait.container';
import * as physics from '../../engine/physics/traits/traits';
import CantGoLeft from '../../platformer/entities/traits/cantGoLeft';
import Crouch from './traits/crouch';
import Glide from './traits/glide';
import Go from './traits/go';
import Jump from './traits/jump';
import Killable from './traits/killable';
import LevelTimer from './traits/leveltimer';
import Player from './traits/player';
import PlayerController from './traits/playerController';
import Stomp from './traits/stomp';
import Walk from './traits/walk.ai';

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
    glide: Glide;
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
        glide: e.getTrait(Glide),
        activateOnSight: e.getTrait(ActivateOnSight),
        emitter: e.getTrait(Emitter),
        levelTimer: e.getTrait(LevelTimer),
        crouch: e.getTrait(Crouch),
        ...physics.getTraits(e),
    };
}
