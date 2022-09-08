import { Entity } from './entity';

export interface PrefabRepository {
  [key: string]: () => Entity;
}
export let entityRepo: PrefabRepository;

export function setEntityRepo(p: PrefabRepository): void {
  entityRepo = p;
}
