import KeyboardState, { KeyState } from '../../engine/io/keyboardState';
import Jump from '../entities/traits/jump';
import Go from '../entities/traits/go';
import TraitCtnr from '../../engine/entities/trait.container';
import Entity from '../../engine/entities/entity';
import Crouch from '../entities/traits/crouch';

export default function setupKeyboard(playerFigure: Entity & TraitCtnr): KeyboardState {
    const go = playerFigure.getTrait(Go);
    const jump = playerFigure.getTrait(Jump);
    const crouch = playerFigure.getTrait(Crouch);

    const isPressed = (keyState): boolean => keyState === KeyState.PRESSED;

    return new KeyboardState()
        .addMapping('Space', keyState => (isPressed(keyState) ? jump.start() : jump.cancel()))
        .addMapping('ShiftLeft', keyState => (go.running = isPressed(keyState)))
        .addMapping('KeyS', keyState => {
            jump.down = isPressed(keyState);
            isPressed(keyState) ? crouch.start() : crouch.cancel();
            if (!isPressed(keyState)) playerFigure.bypassPlatform = false;
        })
        .addMapping('KeyD', keyState => (go.dir += isPressed(keyState) ? 1 : -1))
        .addMapping('KeyA', keyState => (go.dir -= isPressed(keyState) ? 1 : -1));
}
