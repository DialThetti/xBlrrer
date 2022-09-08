import { EventBus } from './event.bus';
import { Receiver } from './receiver';
describe('EventBus', () => {
    const eventBus = new EventBus();
    const receiver: Receiver = { receive: () => a++ };
    let a = 0;
    it('should be created', () => {
        expect(eventBus).toBeTruthy();
    });

    it('should accept subscriber', () => {
        eventBus.subscribe('a', receiver);
        expect(eventBus.receivers['a'].length).toEqual(1);
    });

    it('should trigger subscribers on publish', async () => {
        await eventBus.publish({ topic: 'a', payload: null });
        expect(a).toEqual(1);
    });

    it('should ignore other publish', async () => {
        await eventBus.publish({ topic: 'b', payload: null });
        expect(a).toEqual(1);
    });
    it('should accept unsubscriber', () => {
        eventBus.unsubscribe('a', receiver);
        expect(eventBus.receivers['a'].length).toEqual(0);
    });

    it('should unsubscribe all', () => {
        eventBus.subscribe('a', receiver);
        expect(eventBus.receivers['a'].length).toEqual(1);
        eventBus.unsubscribeAll('a');
        expect(eventBus.receivers['a']).toBeFalsy();
    });
});
