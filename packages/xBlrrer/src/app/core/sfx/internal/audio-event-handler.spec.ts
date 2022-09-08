import { EventBus } from '@dialthetti/feather-engine-events';
import AudioBoard from './audio-board';
import {
  AudioEventHandler,
  playBgmOn,
  playSfxOn,
  setBgmVolumeOn,
  setMasterVolumeOn,
  setSfxVolumeOn,
} from './audio-event-handler';
import * as Events from './events';

describe('AudioEventHandler', () => {
  it('should be created', () => {
    expect(new AudioEventHandler({} as EventBus)).toBeTruthy();
  });

  describe('connect', () => {
    let calledCounter = 0;
    let audioEventHandler;
    beforeEach(() => {
      const eventBus = { subscribe: () => calledCounter++ } as unknown as EventBus;
      audioEventHandler = new AudioEventHandler(eventBus);
    });

    it('should register to events', () => {
      audioEventHandler.connect({} as AudioBoard);
      expect(calledCounter).toEqual(5);
    });
  });
});

describe('playSfxOn', () => {
  it('should call playSfx on AudioBoard', () => {
    let done = false;
    const a = { playSfx: () => (done = true) } as unknown as AudioBoard;
    playSfxOn(a).receive(new Events.PlaySfxEvent({ name: 'a', blocking: false, position: 0 }));
    expect(done).toBeTruthy();
  });
});

describe('playBgmxOn', () => {
  it('should call playBgmx on AudioBoard', () => {
    let done = false;
    const a = { playBgm: () => (done = true) } as unknown as AudioBoard;
    playBgmOn(a).receive(new Events.PlayBgmEvent({ name: 'a' }));
    expect(done).toBeTruthy();
  });
});
describe('setBgmVolumeOn', () => {
  it('should call setBgmVolume on AudioBoard', () => {
    let done = false;
    const a = { setBgmVolume: () => (done = true) } as unknown as AudioBoard;
    setBgmVolumeOn(a).receive(new Events.SetBgmVolumeEvent({ value: 0 }));
    expect(done).toBeTruthy();
  });
});
describe('setSfxVolumeOn', () => {
  it('should call setSfxVolume on AudioBoard', () => {
    let done = false;
    const a = { setSfxVolume: () => (done = true) } as unknown as AudioBoard;
    setSfxVolumeOn(a).receive(new Events.SetSfxVolumeEvent({ value: 0 }));
    expect(done).toBeTruthy();
  });
});
describe('setMasterVolumeOn', () => {
  it('should call setMasterVolume on AudioBoard', () => {
    let done = false;
    const a = { setMasterVolume: () => (done = true) } as unknown as AudioBoard;
    setMasterVolumeOn(a).receive(new Events.SetMasterVolumeEvent({ value: 0 }));
    expect(done).toBeTruthy();
  });
});
