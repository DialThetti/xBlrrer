import { FeatherEngine } from '@dialthetti/feather-engine-core';
import { EntityState, traitRegistry } from '@dialthetti/feather-engine-entities';
import PlatformerLevel from '@extension/platformer/level/platformer-level';

declare const window: any; // eslint-disable-line

export const addDebugToLevel = (level: PlatformerLevel): void => {
  if (window) {
    window.addTrait = name => {
      level.findPlayer().addTraits([traitRegistry.byName(name)]);
    };

    window.removeTrait = name => {
      level.findPlayer().removeTraitByName(name);
    };
    window.testingCheatsEnabled = (enabled): void => {
      FeatherEngine.debugSettings.enabled = enabled;
    };
    window.hitboxesOnly = (enabled): void => {
      FeatherEngine.debugSettings.hitboxesOnly = enabled;
    };
    window.freezeEntities = ()=> {
      level.entities.forEach(e=>e.state === EntityState.UNTRIGGERED)
    }
    window.FeatherEngine = FeatherEngine;
  }
};
