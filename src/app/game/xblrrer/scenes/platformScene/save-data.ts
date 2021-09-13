import { Vector } from '@dialthetti/feather-engine-core';

export const InitialSaveData: Partial<xBlrrerSaveData> = {
    stage: { name: 'forest' },
    collectables: {
        hasGliding: false,
    },
};
export interface xBlrrerSaveData {
    position: Vector;
    life: number;
    stage: {
        name: string;
    };

    collectables: {
        hasGliding: boolean;
    };
}
