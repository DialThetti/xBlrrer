import { Trait } from './trait';

export class TraitRegistry {
  private registry: { [traitName: string]: new () => Trait } = {};

  addTrait(trait: Trait): void {
    this.registry[trait.name] = Object.getPrototypeOf(trait).constructor;
  }

  byName(name: string): Trait {
    return new this.registry[name]();
  }
}

export const traitRegistry = new TraitRegistry();
