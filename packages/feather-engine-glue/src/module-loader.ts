import { argClass, noArgClass } from './injectable';
import 'reflect-metadata';

export class ModuleLoader {
  static load<T>(clazz: noArgClass<T>): Injector {
    return new Injector(new clazz() as any);
  }
}

export class Injector {
  constructor(private module: { injector: Injector; declarations: { [a: string]: any } }) {
    this.prepare();
  }

  prepare(): void {
    Injector.resolveKnown(
      this,
      Object.values(this.module.declarations).map(o => ({ instance: o }))
    );
  }

  static resolveKnown(injector: Injector, list: any[]) {
    const nextIt: Todo = [];
    list.forEach(o => {
      const map = Reflect.getMetadata('inject', o.instance);
      if (map) {
        const values = Object.keys(map).map(k => {
          return { key: k, val: injector.get(map[k]) };
        });

        if (values.some(a => a.val === undefined)) {
          nextIt.push(o);
          //skip
        } else {
          values.forEach(n => (o.instance[n.key] = n.val));
        }
      }
    });
    if (nextIt.length !== 0) Injector.resolveKnown(injector, nextIt);
  }

  get<T>(clazz: noArgClass<T> | argClass<T> | string): T {
    let u;
    if (typeof clazz == 'string') {
      u = this.module.declarations[clazz] ?? undefined;
    } else u = this.module.declarations[clazz.name] ?? undefined;
    if (u) {
      u.injector = this;
    }

    return u;
  }
}

export const FeatherModule = (options: { declares: (noArgClass<any> | argClass<any>)[] }) => {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/ban-types
  return (constructor: Function) => {
    const declarations: { [name: string]: any } = options.declares
      .map((a: new (...arg: any[]) => any) => {
        return { [a.name]: new a() };
      })
      .reduce((a, b) => ({ ...a, ...b }), {});

    constructor.prototype.declarations = declarations;
  };
};

type Todo = { instance: any }[];
class F {}
