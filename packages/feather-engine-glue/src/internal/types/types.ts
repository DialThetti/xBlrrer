import { Injector } from '../injector';

export type noArgClass<T> = new () => T;
export type argClass<T> = new (...arg: unknown[]) => T;

export type Class<T> = noArgClass<T> | argClass<T>;
// eslint-disable-next-line @typescript-eslint/ban-types
export type ReflectiveObject = Object & { reflection?: { [key: string]: string } };

export interface ReflectiveObjectRef {
  instance: ReflectiveObject;
}

export interface ModuleInstance {
  injector: Injector;
  declarations: { [a: string]: ReflectiveObject };
  import: { [a: string]: ReflectiveObject };
}
