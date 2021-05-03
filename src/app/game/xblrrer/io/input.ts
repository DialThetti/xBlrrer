import Entity from '@engine/core/entities/entity';
import TraitCtnr from '@engine/core/entities/trait.container';
import KeyboardState, { KeyState } from '@engine/core/io/keyboardState';
import Crouch from '../entities/traits/crouch';
import Glide from '../entities/traits/glide';
import Go from '../entities/traits/go';
import Jump from '../entities/traits/jump';

export default function setupKeyboard(playerFigure: Entity & TraitCtnr): KeyboardState {
    const go = playerFigure.getTrait(Go);
    const jump = playerFigure.getTrait(Jump);
    const crouch = playerFigure.getTrait(Crouch);
    const glide = playerFigure.getTrait(Glide);

    const isPressed = (keyState): boolean => keyState === KeyState.PRESSED;

    return (
        new KeyboardState()
            .addMapping('Space', (keyState) => {
                if (isPressed(keyState)) {
                    if (glide && jump.falling) {
                        glide.start();
                    } else {
                        jump.start();
                    }
                } else {
                    if (glide && glide.gliding) {
                        glide.cancel();
                    } else {
                        jump.cancel();
                    }
                }
            })
            //   .addMapping('ShiftLeft', (keyState) => (go.running = isPressed(keyState)))
            .addMapping('KeyS', (keyState) => {
                if (isPressed(keyState)) {
                    if (!jump.falling) crouch.start();
                } else {
                    crouch.cancel();
                }
                if (!isPressed(keyState)) playerFigure.bypassPlatform = false;
            })
            .addMapping('KeyD', (keyState) => go.right(isPressed(keyState)))
            .addMapping('KeyA', (keyState) => go.left(isPressed(keyState)))
    );
}
