export interface TmxModel {
    compressionlevel: number;
    height: number;
    infinite: false;
    layers: TmxLayer[];
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
    width: number;
}

export interface TmxLayer {
    chunks: TmxChunk[];
    height: number;
    id: number;
    name: string;
    opacity: number;
    startx: number;
    starty: number;
    type: 'tilelayer' | string;
    visible: boolean;
    width: number;
    x: number;
    y: number;
}

export interface TmxChunk {
    data: number[];
    height: number;
    width: number;
    x: number;
    y: number;
}
