import { ModuleLoader } from '../module-loader';
import { noArgClass, ReflectiveObject } from '../types/types';

export const FeatherModule = (options: {
  declares?: noArgClass<ReflectiveObject>[];
  imports?: noArgClass<ReflectiveObject>[];
}) => {
  return (constructor: { prototype: { declarations?: ReflectiveObject } }) => {
    const resolver = new FeatherModuleResolver(options);

    constructor.prototype.declarations = {
      ...resolver.getImportedDeclarations(),
      ...resolver.getDirectDeclarations(),
    };
  };
};

class FeatherModuleResolver {
  constructor(
    private options: { declares?: noArgClass<ReflectiveObject>[]; imports?: noArgClass<ReflectiveObject>[] }
  ) {}

  getImportedDeclarations(): { [name: string]: ReflectiveObject } {
    return (this.options.imports ?? [])
      .map(importedModule => ModuleLoader.load(importedModule).module.declarations)
      .reduce(this.flatMap, {});
  }

  getDirectDeclarations(): { [name: string]: ReflectiveObject } {
    return (this.options.declares ?? [])
      .map((declaredObject: noArgClass<ReflectiveObject>) => ({
        [declaredObject.name]: new declaredObject(),
      }))
      .reduce(this.flatMap, {});
  }

  flatMap<T>(a: T, b: T): T {
    return { ...a, ...b };
  }
}
