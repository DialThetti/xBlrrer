import Entity from '../../engine/entities/entity';
import BoundingBox from '../../engine/math/boundingBox';
import Vector from '../../engine/math/vector';
import Camera from '../../engine/world/camera';

export default class MetroidCamera extends Camera {
    cameras: Camera[];
    currentCamIndex = 0;
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
                this.transition.targetPosition = this.currentCam.box.position;
            }
            const delta = this.transition.get(1.5 * deltaTime);
            this.currentCam.box.left = delta.x;
            this.currentCam.box.top = delta.y;
            if (this.transition.delta >= 1) this.transition = null;
        }
    }

    private updateCurrentCam(playerFigure: Entity): void {
        const x = this.cameras.findIndex((a) => a.box.overlaps(playerFigure.bounds));
        if (x != -1) {
            if (x != this.currentCamIndex)
                this.transition = new Transition(this.currentCam.box.position, this.cameras[x].box.position);
            this.currentCamIndex = x;
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
