import { debugSettings } from '@engine/core/debug';
import Entity from '@engine/core/entities/entity';
import BoundingBox from '@engine/core/math/boundingBox';
import Vector from '@engine/core/math/vector';
import Camera from '@engine/core/world/camera';

export default class MetroidCamera extends Camera {
    cameras: Camera[];
    currentCamIndex = -1;
    transition: Transition;
    constructor(viewPorts: BoundingBox[]) {
        super();
        this.cameras = viewPorts.map((a) => new Camera(a));
    }

    get box(): BoundingBox {
        return this.currentCam.box;
    }

    private get currentCam(): Camera {
        return this.cameras[this.currentCamIndex];
    }

    update(playerFigure: Entity, deltaTime: number): void {
        this.updateCurrentCam(playerFigure);

        this.currentCam.update(playerFigure, deltaTime);
        if (this.transition != null) {
            if (this.transition.delta == 0) {
                this.transition.targetPosition = this.currentCam.box.pos;
            }
            const delta = this.transition.get(1.5 * deltaTime);
            this.currentCam.box.left = delta.x;
            this.currentCam.box.top = delta.y;
            if (this.transition.delta >= 1) this.transition = null;
        }
    }

    private updateCurrentCam(playerFigure: Entity): void {
        const potentionallyNewCam = this.cameras
            .map((a) => a.viewPort)
            .findIndex((a) => a.overlaps(playerFigure.bounds));
        if (potentionallyNewCam != -1) {
            if (potentionallyNewCam != this.currentCamIndex) {
                console.debug(`[camera] Switching cameras from ${this.currentCamIndex} to ${potentionallyNewCam}`);
                if (this.currentCamIndex !== -1)
                    this.transition = new Transition(
                        this.currentCam.box.pos,
                        this.cameras[potentionallyNewCam].box.pos,
                    );
            }

            this.currentCamIndex = potentionallyNewCam;
        } else {
            if (debugSettings.enabled) {
                console.debug(`[camera] no new Camera found!`);
                console.log(playerFigure.bounds);
                console.log(this.cameras.map((a) => a.box));

                debugger;
            }
        }
    }
}

class Transition {
    delta = 0; //0..1
    constructor(private currentPosition: Vector, public targetPosition: Vector) {}
    get(deltaTime: number): Vector {
        this.delta += deltaTime;
        if (this.delta > 1) this.delta = 1;
        return new Vector(
            this.currentPosition.x * (1 - this.delta) + this.targetPosition.x * this.delta,
            this.currentPosition.y * (1 - this.delta) + this.targetPosition.y * this.delta,
        );
    }
}
