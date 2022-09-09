import { Class, ModuleInstance, ReflectiveObject, ReflectiveObjectRef } from './types/types';

export class Injector {
  constructor(public readonly module: ModuleInstance) {
    this.prepare();
  }

  prepare(): void {
    this.resolveKnown(Object.values(this.module.declarations).map(instance => ({ instance })));
  }

  resolveKnown(list: ReflectiveObjectRef[]): void {
    const nextIt: ReflectiveObjectRef[] = list
      .map(o => {
        try {
          this.injectMembers(o.instance);
          return undefined;
        } catch (error) {
          return o;
        }
      })
      .filter(a => a !== undefined) as ReflectiveObjectRef[];
    if (nextIt.length !== 0) {
      this.resolveKnown(nextIt);
    }
  }

  injectMembers(obj: ReflectiveObject): void {
    const metadata = obj.reflection;
    if (!metadata) {
      return;
    }
    const instances = Object.keys(metadata).map(key => ({ key, value: this.get(metadata[key]) }));

    if (instances.some(instance => !instance.value)) {
      throw new Error('missing dependency');
    }

    instances.forEach(instance => ((obj as Record<string, unknown>)[instance.key] = instance.value));
  }

  get<T>(clazz: Class<T> | string): T {
    let instance;
    if (typeof clazz == 'string') {
      instance = (this.module.declarations[clazz] as T) ?? undefined;
      if (!instance) {
        throw new Error(`${clazz} not found in module graph`);
      }
    } else {
      instance = (this.module.declarations[clazz.name] as T) ?? undefined;
      if (!instance) {
        throw new Error(`${clazz.name} not found in module graph`);
      }
    }
    return instance;
  }
}
