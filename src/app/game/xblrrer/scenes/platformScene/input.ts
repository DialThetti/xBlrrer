import Entity from '@engine/core/entities/entity';
import TraitCtnr from '@engine/core/entities/trait.container';
import SceneMachine from '@engine/scenes/scene-machine';
import Killable from '@extension/platformer/entities/traits/killable';
import { FeatherEngine, KeyListener, log } from 'feather-engine-core';
import Crouch from '../../entities/traits/crouch';
import Glide from '../../entities/traits/glide';
import Go from '../../entities/traits/go';
import Jump from '../../entities/traits/jump';
import { xBlrrerSaveData } from './save-data';

export default class PlatformerKeyListener implements KeyListener {
    constructor(private playerFigure: Entity & TraitCtnr) {}
    keyDown(code: string): void {
        const go = this.playerFigure.getTrait(Go);
        const jump = this.playerFigure.getTrait(Jump);
        const crouch = this.playerFigure.getTrait(Crouch);
        const glide = this.playerFigure.getTrait(Glide);
        const killable = this.playerFigure.getTrait(Killable);
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
            case 'Digit5':
                // TODO Due by Actions
                FeatherEngine.getSaveDataSystem<xBlrrerSaveData>().pushData({
                    position: this.playerFigure.pos,
                    life: killable.hp,
                    stage: { name: 'forest' },
                    collectables: { hasGliding: this.playerFigure.hasTrait(Glide) },
                });
                FeatherEngine.getSaveDataSystem().storeCurrentData(0);
                break;
            case 'Digit9':
                FeatherEngine.getSaveDataSystem().loadCurrentData(0);
                SceneMachine.INSTANCE.setScene('game', true, true);
                break;
            default:
                log(this, `Key ${code} was pressed without listener`);
        }
    }

    keyUp(code: string): void {
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

    keyPressed(code: string): void {}
}
