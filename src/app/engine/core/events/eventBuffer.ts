import Event from './event';

/**
 * A class to handle Events.
 */
export default class EventBuffer {
    private events: Event<unknown>[] = [];

    /**
     * emits an event with name and payload, which will be queued
     * @param name - The name of the Event
     * @param payload - a payload of undefined structure. Each Event processor can define its own required payload
     */
    emit(event: Event<unknown>): void {
        this.events.push(event);
    }
    /**
     *
     * execute all Events with fitting name and remove them afterwards
     * @param name - The name of the Event
     * @param callback - a function which shall be called on the queued event
     */
    process<T>(name: string, callback: (t: T) => void): void {
        this.events.filter((event) => event.name === name).forEach((event) => callback(event.payload as T));
        this.events = this.events.filter((event) => event.name !== name);
    }
}
