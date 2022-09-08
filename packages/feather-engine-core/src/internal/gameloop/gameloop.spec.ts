import { RenderContext } from '../renderer/canvas-renderer';
import { GameLoop } from './gameloop';
import { OnDraw, OnInput, OnUpdate } from './gameloop-listeners';

describe('GameLoop', () => {
  let queue = '';
  it('should be singleton', () => {
    expect(GameLoop['instance']).toBe(GameLoop['instance']);
  });
  it('should register OnInput Listener', () => {
    GameLoop.register({
      handleInput: () => {
        queue += 'A';
      },
    } as OnInput);
    const instance: GameLoop = GameLoop['instance'];
    expect(instance['onInput'].length).toBe(1);
  });
  it('should register OnUpdate Listener', () => {
    GameLoop.register({
      update: (dT: number) => {
        queue += 'B';
      },
    } as OnUpdate);
    const instance: GameLoop = GameLoop['instance'];
    expect(instance['onUpdate'].length).toBe(1);
  });
  it('should register OnDraw Listener', () => {
    GameLoop.register({
      draw: (rc: RenderContext) => {
        queue += 'C';
      },
    } as OnDraw);
    const instance: GameLoop = GameLoop['instance'];
    expect(instance['onDraw'].length).toBe(1);
  });
  it('should notify all listeners in correct order', () => {
    const instance: GameLoop = GameLoop['instance'];
    instance['update'](1, {} as RenderContext);
    expect(queue).toBe('ABC');
  });
  it('should start a timer on start and remove it on cancel', () => {
    const instance: GameLoop = GameLoop['instance'];
    expect(instance['timer']).toBeNull();
    GameLoop.start();
    expect(instance['timer']).not.toBeUndefined();
    GameLoop.cancel();
    expect(instance['timer']).toBeNull();
  });
  it('should not start a second timer on start', () => {
    const instance: GameLoop = GameLoop['instance'];
    expect(instance['timer']).toBeNull();
    GameLoop.start();
    expect(instance['timer']).not.toBeUndefined();
    const timer = instance['timer'];
    GameLoop.start();
    expect(instance['timer']).toEqual(timer);
  });
});
