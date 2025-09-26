export interface TsxModel {
  columns: number;

  image: string;
  imageheight: number;
  imageweight: number;
  margin: number;

  name: string;
  spacing: number;
  tilecount: number;

  tiledversion: string;
  tileheight: number;
  tilewidth: number;
  type: string;
  version: string;
  tiles?: TsxTileModel[];
}

export interface TsxTileModel {
  id: number;
  objectgroup?: { objects: { x: number; y: number; height: number; width: number }[] };
  properties: { name: string; type: string; value: unknown }[];
  animation?: {
    duration: number;
    tileid: number;
  }[];
}
