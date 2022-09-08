export interface Settings {
  masterVolume: number;
  bgmVolume: number;
  sfxVolume: number;
}
export const initialData: Settings = {
  masterVolume: 5,
  bgmVolume: 5,
  sfxVolume: 5,
};

export const settingsSaveSlot = 99;
