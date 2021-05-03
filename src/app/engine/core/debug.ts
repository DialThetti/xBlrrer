import Entity from './entities/entity';
import Camera from './world/camera';

export const debugSettings = {
    enabled: false,
    hitboxesOnly: false,
    showFPS: false,
};
let initializedOnce = false;

export function setupMouseControl(canvas: HTMLCanvasElement, playerFigure: Entity, camera: Camera): void {
    let lastEvent;
    debugSettings.enabled = true;
    if (initializedOnce) {
        return;
    }

    canvas.addEventListener('contextmenu', (ev) => ev.preventDefault());
    initializedOnce = true;
}

export function removeMouseControl(): void {
    debugSettings.enabled = false;
}
