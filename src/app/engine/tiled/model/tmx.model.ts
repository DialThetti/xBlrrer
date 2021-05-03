export type InfiniteTmxModel = TmxModel<InfiniteTmxLayer>;

export type FiniteTmxModel = TmxModel<FiniteTmxLayer>;

export interface TmxModel<T extends TmxLayer> {
    compressionlevel: number;
    height: number;
    width: number;
    infinite: boolean;
    layers: (T | TmxObjectLayer)[];
    nextlayerid: number;
    nextobjectid: number;
    orientation: 'orthogonal';
    renderorder: 'right-down';
    tiledversion: '1.3.3' | string;
    tileheight: number;
    tilesets: [
        {
            firstgid: number;
            source: string;
        },
    ];
    tilewidth: number;
    type: 'map' | string;
    version: number;
}

export interface FiniteTmxLayer extends TmxLayer {
    data: number[];
}

export interface InfiniteTmxLayer extends TmxLayer {
    chunks: TmxChunk[];
    startx: number;
    starty: number;
}

export interface TmxChunk {
    data: number[];
    height: number;
    width: number;
    x: number;
    y: number;
}

export interface TmxLayer {
    height: number;
    id: number;
    name: string;
    opacity: number;
    type: 'tilelayer' | string;
    visible: boolean;
    width: number;
    x: number;
    y: number;
}

export interface TmxObjectLayer {
    draworder: 'topdown';
    id: number;
    name: string;
    objects: {
        height: number;
        id: number;
        name: string;
        rotation: number;
        type: string;
        visible: boolean;
        width: number;
        x: number;
        y: number;
    }[];
    opacity: number;
    type: 'objectgroup';
    visible: boolean;
    x: number;
    y: number;
}

export function isInfiniteLayer(layer: TmxLayer): layer is InfiniteTmxLayer {
    return 'chunks' in layer;
}

export function isFiniteLayer(layer: TmxLayer): layer is FiniteTmxLayer {
    return 'data' in layer;
}
