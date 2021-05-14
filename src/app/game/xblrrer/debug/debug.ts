import { debugSettings } from '@engine/core/debug';
import { traitRegistry } from '@engine/core/entities/trait-registry';
import PlatformerLevel from '@extension/platformer/level';

declare const window: any; // eslint-disable-line

export function addDebugToLevel(level: PlatformerLevel): void {
    if (window) {
        window.addTrait = (name) => {
            level.findPlayer().addTraits([traitRegistry.byName(name)]);
        };

        window.removeTrait = (name) => {
            level.findPlayer().removeTraitByName(name);
        };
        window.testingCheatsEnabled = (enabled): void => {
            debugSettings.enabled = enabled;
        };
        window.hitboxesOnly = (enabled): void => {
            debugSettings.hitboxesOnly = enabled;
        };
    }
}
