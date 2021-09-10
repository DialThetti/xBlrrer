import { Entity } from './entity';

export type PrefabRepository = { [key: string]: () => Entity };
export let entityRepo: PrefabRepository;

export function setEntityRepo(p: PrefabRepository): void {
    entityRepo = p;
}
