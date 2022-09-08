import { KeyboardInput, KeyListener, KeyState } from './input-listener';
describe('KeyboardInput', () => {
  let down = false;
  const keyListener = {
    keyDown: () => {
      down = true;
    },
    keyUp: () => {
      down = false;
    },
    keyPressed: () => {},
  } as KeyListener;

  it('should be a singleton', () => {
    expect(KeyboardInput['instance']).toBe(KeyboardInput['instance']);
  });

  describe('addKeyListener', () => {
    it('should add a keyListener to the listener list', () => {
      KeyboardInput.addKeyListener(keyListener);
      expect(KeyboardInput['instance']['keyListeners'].length).toBe(1);
      expect(KeyboardInput['instance']['keyListeners'][0]).toBe(keyListener);
    });
  });
  describe('clearKeyListeners', () => {
    it('should clear all keyListeners', () => {
      KeyboardInput.addKeyListener(keyListener);
      KeyboardInput.clearKeyListeners();
      expect(KeyboardInput['instance']['keyListeners'].length).toBe(0);
    });
  });
  describe('handleInput', () => {
    const instance: KeyboardInput = KeyboardInput['instance'];
    beforeEach(() => {
      KeyboardInput.addKeyListener(keyListener);
      instance['keyStates'] = { A: KeyState.PRESSED };
      down = false;
    });
    it('should detect a change', () => {
      instance['keyStatesChanges'] = { A: KeyState.PRESSED };
      instance.handleInput();
      expect(instance['keyStatesChanges']).toStrictEqual({});
      expect(down).toBeTruthy();
    });
    it('should ignore already pressed buttons', () => {
      down = false;
      instance.handleInput();
      expect(instance['keyStatesChanges']).toStrictEqual({});
      expect(down).toBeFalsy();
    });
    it('should handly keyup', () => {
      instance['keyStatesChanges'] = { A: KeyState.RELEASED };
      down = true;
      instance.handleInput();
      expect(instance['keyStatesChanges']).toStrictEqual({});
      expect(down).toBeFalsy();
    });
  });
  describe('handleEvent', () => {
    it('should create a keyDown change', () => {
      const instance = KeyboardInput['instance'];
      instance['keyStates'] = {};
      instance['handleEvent']({ code: 'A', type: 'keydown' } as KeyboardEvent);
      expect(instance['keyStates']).toStrictEqual({ A: KeyState.PRESSED });
      expect(instance['keyStatesChanges']).toStrictEqual({ A: KeyState.PRESSED });
    });
    it('should not change anything if already pressed', () => {
      const instance = KeyboardInput['instance'];
      instance['keyStatesChanges'] = {};
      instance['handleEvent']({ code: 'A', type: 'keydown' } as KeyboardEvent);
      expect(instance['keyStates']).toStrictEqual({ A: KeyState.PRESSED });
      expect(instance['keyStatesChanges']).toStrictEqual({});
    });
    it('should create a keyDown change', () => {
      const instance = KeyboardInput['instance'];
      instance['handleEvent']({ code: 'A', type: 'keyup' } as KeyboardEvent);
      expect(instance['keyStates']).toStrictEqual({ A: KeyState.RELEASED });
      expect(instance['keyStatesChanges']).toStrictEqual({ A: KeyState.RELEASED });
    });
  });
});
