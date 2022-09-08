// eslint-disable-next-line @typescript-eslint/ban-types
export type noArgClass<T> = new () => T;
export type argClass<T> = new (...arg: any[]) => T;

export function Inject(t: new () => any) {
  return function (target: Object, propertyKey: string) {
    const u: { [s: string]: any } = Reflect.getMetadata('inject', target) || {};
    u[propertyKey] = t.name;
    Reflect.defineMetadata('inject', u, target);
    return undefined; //target.injector.get(t);
  };
}
