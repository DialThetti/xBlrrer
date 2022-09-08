import { Entity } from '@dialthetti/feather-engine-entities';
import { Context, TraitAdapter } from './trait';

export class Activatable extends TraitAdapter {
  active = false;
  constructor(private activateFn?: (e: Entity, context: Context) => void) {
    super('activatable');
  }
  update(entity: Entity, context: Context): void {
    if (this.active) {
      this.activateFn(entity, context);
    }
    this.active = false;
  }
  activate(): void {
    this.active = true;
  }
}
