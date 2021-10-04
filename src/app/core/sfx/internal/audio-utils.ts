export function determineNewVolume(v: number | string, oldVolume: number): number {
    let newVol: number;
    if (typeof v === 'string') {
        newVol = parseFloat(v) + oldVolume;
    } else {
        newVol = v;
    }
    return Math.max(0, Math.min(1, newVol));
}
