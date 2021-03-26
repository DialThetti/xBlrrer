import Entity from './entities/entity';
import Camera from './world/camera';

export let debug = false;
let initializedOnce = false;

export function setupMouseControl(canvas: HTMLCanvasElement, playerFigure: Entity, camera: Camera): void {
    let lastEvent;
    debug = true;
    if (initializedOnce) {
        return;
    }
    ['mousedown', 'mousemove'].forEach((n) => {
        canvas.addEventListener(n, (ev: MouseEvent) => {
            if (!debug) {
                return;
            }
            if (ev.buttons === 1) {
                playerFigure.vel.set(0, 0);
                playerFigure.pos.set(ev.offsetX + camera.pos.x, ev.offsetY + camera.pos.y);
            } else if (ev.buttons === 2 && lastEvent && lastEvent.buttons == 2 && lastEvent.type === 'mousemove') {
                camera.pos.x -= ev.clientX - lastEvent.clientX;
                camera.pos.y -= ev.clientY - lastEvent.clientY;
                if (camera.pos.x < 0) {
                    camera.pos.x = 0;
                }
                if (camera.pos.y < 0) {
                    camera.pos.y = 0;
                }
            }
            lastEvent = ev;
        });
    });
    canvas.addEventListener('contextmenu', (ev) => ev.preventDefault());
    initializedOnce = true;
}

export function removeMouseControl(): void {
    debug = false;
}
