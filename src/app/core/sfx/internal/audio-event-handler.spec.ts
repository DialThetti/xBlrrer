import { EventBus } from '@dialthetti/feather-engine-events';
import { AudioEventHandler } from './audio-event-handler';
import AudioBoard from './audioboard';

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
