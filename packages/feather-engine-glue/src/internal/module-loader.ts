import { Injector } from './injector';
import { ModuleInstance, noArgClass } from './types/types';

export class ModuleLoader {
  static load<T>(clazz: noArgClass<T>): Injector {
    return new Injector(new clazz() as ModuleInstance);
  }
}
