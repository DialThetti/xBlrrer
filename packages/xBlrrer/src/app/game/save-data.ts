import { Vector } from '@dialthetti/feather-engine-core';

export const InitialSaveData: Partial<xBlrrerSaveData> = {
  stage: { name: 'v2/1-awakening' },
  collectables: {
    hasGliding: false,
  },
};
export interface xBlrrerSaveData {
  position: Vector;
  life: number;
  comboSkill: number;
  stage: {
    name: string;
  };

  collectables: {
    hasGliding: boolean;
  };
  savePoint: Vector;
}
