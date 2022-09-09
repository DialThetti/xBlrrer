import { noArgClass, ReflectiveObject } from '../types/types';

export const Inject = <T>(t: noArgClass<T>) => {
  return (target: ReflectiveObject, propertyKey: string): void => {
    const metadata: { [s: string]: string } = target.reflection || {};
    metadata[propertyKey] = t.name;
    target.reflection = metadata;
  };
};
