import { BoundingBox, FeatherEngine, PauseGameEvent, ResumeGameEvent, Vector } from '@dialthetti/feather-engine-core';
import { Entity } from '@dialthetti/feather-engine-entities';
import { getAnalytics } from 'src/app/core/analytics/analytics_connetor';
import { TransitionTrackingEvent } from 'src/app/core/analytics/events';
import Camera from 'src/app/core/rendering/camera';

export default class MetroidCamera extends Camera {
    cameras: Camera[];
    currentCamIndex = -1;
    transition: Transition;
    timeOnScreen = 0;
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

    update(playerFigure: Entity, dT: number): void {
        this.timeOnScreen += dT;
        this.updateCurrentCam(playerFigure);

        this.currentCam.update(playerFigure, dT);
        if (this.transition != null) {
            if (this.transition.delta == 0) {
                this.transition.targetPosition = this.currentCam.box.pos;
            }
            const delta = this.transition.get(1.5 * dT);
            this.currentCam.box.left = delta.x;
            this.currentCam.box.top = delta.y;
            if (this.transition.delta >= 1) {
                this.transition = null;
                FeatherEngine.eventBus.publish(new ResumeGameEvent());
                this.timeOnScreen = 0;
            }
        }
    }

    private updateCurrentCam(playerFigure: Entity): void {
        const potentionallyNewCam = this.cameras
            .map((a) => a.viewPort)
            .findIndex((a) => a.overlaps(playerFigure.bounds));
        if (potentionallyNewCam != -1) {
            if (potentionallyNewCam != this.currentCamIndex) {
                if (this.currentCamIndex !== -1) {
                    this.transition = new Transition(
                        this.currentCam.box.pos,
                        this.cameras[potentionallyNewCam].box.pos,
                    );
                    FeatherEngine.eventBus.publish(new PauseGameEvent());
                    FeatherEngine.eventBus.publish(new TransitionTrackingEvent(
                        {
                            level: "forest",
                            timeOnScreen: this.timeOnScreen,
                            transition: { from: this.currentCamIndex, to: potentionallyNewCam }
                        }
                    ));
                }
            }

            this.currentCamIndex = potentionallyNewCam;
        } else {
            if (FeatherEngine.debugSettings.enabled) {
                console.debug(`[camera] no new Camera found!`);
                console.log(playerFigure.bounds);
                console.log(this.cameras.map((a) => a.box));
            }
        }
    }
}

class Transition {
    delta = 0; //0..1
    constructor(private currentPosition: Vector, public targetPosition: Vector) { }
    get(deltaTime: number): Vector {
        this.delta += deltaTime;
        if (this.delta > 1) this.delta = 1;
        return new Vector(
            this.currentPosition.x * (1 - this.delta) + this.targetPosition.x * this.delta,
            this.currentPosition.y * (1 - this.delta) + this.targetPosition.y * this.delta,
        );
    }
}
