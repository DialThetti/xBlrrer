import {
  BoundingBox,
  debug,
  FeatherEngine,
  PauseGameEvent,
  ResumeGameEvent,
  Vector,
} from '@dialthetti/feather-engine-core';
import { Entity } from '@dialthetti/feather-engine-entities';
import { Camera } from 'src/app/core/rendering';

export default class MetroidCamera extends Camera {
  cameras: Camera[];
  currentCamIndex = -1;
  transition: Transition;
  constructor(viewPorts: BoundingBox[]) {
    super();
    this.cameras = viewPorts.map(a => new Camera(a));
  }

  get box(): BoundingBox {
    return this.currentCam.box;
  }

  private get currentCam(): Camera {
    return this.cameras[this.currentCamIndex];
  }

  update(playerFigure: Entity, dT: number): void {
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
      }
    }
  }

  private updateCurrentCam(playerFigure: Entity): void {
    const potentionallyNewCam = this.cameras.map(a => a.viewPort).findIndex(a => a.overlaps(playerFigure.bounds));
    if (potentionallyNewCam != -1) {
      if (potentionallyNewCam != this.currentCamIndex) {
        if (this.currentCamIndex !== -1) {
          this.transition = new Transition(this.currentCam.box.pos, this.cameras[potentionallyNewCam].box.pos);
          FeatherEngine.eventBus.publish(new PauseGameEvent());
        }
      }

      this.currentCamIndex = potentionallyNewCam;
    } else {
      if (FeatherEngine.debugSettings.enabled) {
        debug(this, 'no new Camera found!');
        debug(this, `${playerFigure.bounds}`);
        debug(this, `${this.cameras.map(a => a.box)}`);
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
      this.currentPosition.y * (1 - this.delta) + this.targetPosition.y * this.delta
    );
  }
}
