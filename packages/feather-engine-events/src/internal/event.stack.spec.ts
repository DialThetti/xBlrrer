import { EventStack } from './event.stack';
import { Receiver } from './receiver';
describe('EventBus', () => {
    let eventStack = new EventStack();
    let receiver: Receiver = { receive: () => a++ };
    let a = 0;
    it('should be created', () => {
        expect(eventStack).toBeTruthy();
    });

    it('should ignore empty stack', () => {
        eventStack.process('a', receiver);
        expect(a).toEqual(0);
    });

    it('should put on stack with publish', async () => {
        await eventStack.publish({ topic: 'a', payload: null });
        expect(a).toEqual(0);
    });

    it('should drain stack', () => {
        eventStack.process('a', receiver);
        expect(a).toEqual(1);
        eventStack.process('a', receiver);
        expect(a).toEqual(1);
    });
    it('should put on stack with publish and expand stack', async () => {
        a = 0;
        await eventStack.publish({ topic: 'a', payload: null });
        await eventStack.publish({ topic: 'a', payload: null });
    });

    it('should drain stack with multiple entries', () => {
        eventStack.process('a', receiver);
        expect(a).toEqual(2);
    });
});
