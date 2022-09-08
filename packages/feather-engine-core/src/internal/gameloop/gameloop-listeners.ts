import { RenderContext } from '../renderer/canvas-renderer';

/**
 * a input observer, which will be invoked by the GameLoop
 *
 * implement `handleInput` to get notified
 */
export interface OnInput {
  handleInput(): void;
}
/**
 * a update observer, which will be invoked by the GameLoop
 *
 * implement `update(delatTime)` to get notified
 */
export interface OnUpdate {
  update(deltaTime: number): void;
}
/**
 * a draw observer, which will be invoked by the GameLoop
 *
 * implement `draw()` to get notified
 */
export interface OnDraw {
  draw(renderingContext: RenderContext): void;
}

export type GameLoopListener = OnInput | OnUpdate | OnDraw;
