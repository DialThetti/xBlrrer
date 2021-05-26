import Entity from '@engine/core/entities/entity';
import TraitCtnr from '@engine/core/entities/trait.container';
import { KeyListener } from 'feather-engine-core';
import Crouch from '../../entities/traits/crouch';
import Glide from '../../entities/traits/glide';
import Go from '../../entities/traits/go';
import Jump from '../../entities/traits/jump';

export default class PlatformerKeyListener implements KeyListener {
    constructor(private playerFigure: Entity & TraitCtnr) {}
    keyDown(code: String): void {
        const go = this.playerFigure.getTrait(Go);
        const jump = this.playerFigure.getTrait(Jump);
        const crouch = this.playerFigure.getTrait(Crouch);
        const glide = this.playerFigure.getTrait(Glide);
        switch (code) {
            case 'Space':
                if (glide && jump.falling) {
                    glide.start();
                } else {
                    jump.start();
                }
                break;
            case 'KeyS':
                if (!jump.falling) crouch.start();
                break;
            case 'KeyA':
                go.left(true);
                break;
            case 'KeyD':
                go.right(true);
                break;
        }
    }

    keyUp(code: String): void {
        const go = this.playerFigure.getTrait(Go);
        const jump = this.playerFigure.getTrait(Jump);
        const crouch = this.playerFigure.getTrait(Crouch);
        const glide = this.playerFigure.getTrait(Glide);
        switch (code) {
            case 'Space':
                if (glide && glide.gliding) {
                    glide.cancel();
                } else {
                    jump.cancel();
                }
                break;
            case 'KeyS':
                crouch.cancel();
                break;
            case 'KeyA':
                go.left(false);
                break;
            case 'KeyD':
                go.right(false);
                break;
        }
    }

    keyPressed(code: String): void {}
}
