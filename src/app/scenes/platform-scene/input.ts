import { FeatherEngine, KeyListener, log } from '@dialthetti/feather-engine-core';
import { Entity, TraitCtnr } from '@dialthetti/feather-engine-entities';
import { Attack, Crouch, Glide, Go, Jump, Killable, Player } from '@game/entities/traits';
import { ShowSceneEvent } from 'src/app/core/scenes';
import { SetMasterVolumeEvent } from 'src/app/core/sfx';
import { xBlrrerSaveData } from '../../game/save-data';
import { Keys } from '../keys';
import { SceneNames } from '../scene-names';

export default class Input implements KeyListener {
  constructor(private playerFigure: Entity & TraitCtnr) { }
  keyDown(code: string): void {
    const go = this.playerFigure.getTrait(Go);
    const jump = this.playerFigure.getTrait(Jump);
    const crouch = this.playerFigure.getTrait(Crouch);
    const glide = this.playerFigure.getTrait(Glide);
    const killable = this.playerFigure.getTrait(Killable);
    const attack = this.playerFigure.getTrait(Attack);
    const player = this.playerFigure.getTrait(Player);
    switch (code) {
      case Keys.A:
        if (glide && jump.falling) {
          glide.start();
        } else {
          jump.start();
        }
        break;
      case Keys.DOWN:
        if (!jump.falling) crouch.start();
        break;
      case Keys.LEFT:
        go.left(true);
        break;
      case Keys.RIGHT:
        go.right(true);
        break;
      case Keys.UP:
        player.activate();
        break;
      case Keys.B:
        if (attack)
          attack.attack();
        break;
      case 'Digit1':
        FeatherEngine.eventBus.publish(new SetMasterVolumeEvent({ value: '-0.1' }));
        break;
      case 'Digit2':
        FeatherEngine.eventBus.publish(new SetMasterVolumeEvent({ value: '+0.1' }));

        break;
      case 'Digit5':
        if (!FeatherEngine.debugSettings.enabled) {
          return;
        }
        // TODO Due by Actions
        FeatherEngine.getSaveDataSystem<xBlrrerSaveData>().pushData({
          position: this.playerFigure.pos,
          life: killable.hp,
          comboSkill: attack?.comboSkill ?? 0,
          stage: { name: 'forest' },
          collectables: { hasGliding: this.playerFigure.hasTrait(Glide) },
        });
        FeatherEngine.getSaveDataSystem().storeCurrentData(0);
        break;
      case 'Digit9':
        if (!FeatherEngine.debugSettings.enabled) {
          return;
        }
        FeatherEngine.getSaveDataSystem().loadCurrentData(0);
        FeatherEngine.eventBus.publish(
          new ShowSceneEvent({ name: SceneNames.gameScene, withLoading: true, forceLoading: true })
        );
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
      case Keys.A:
        if (glide && glide.gliding) {
          glide.cancel();
        } else {
          jump.cancel();
        }
        break;
      case Keys.DOWN:
        crouch.cancel();
        break;
      case Keys.LEFT:
        go.left(false);
        break;
      case Keys.RIGHT:
        go.right(false);
        break;
    }
  }

  keyPressed(): void {
    // No key pressed atm
  }
}
