import { EventPublisher } from './event.publisher';
import { Receiver } from './receiver';
import { Subject } from './subject';

export class EventBus implements EventPublisher<Subject<any>> {
    receivers: {
        [key: string]: Receiver[];
    } = {};

    defaultTriesCount: number = 3;

    public async publish(subject: Subject<any>, tries: number = 0): Promise<void> {
        if (tries === 0) {
            tries = this.defaultTriesCount;
        }

        const receivers = this.getTopicReceivers(subject.topic);

        // Run promises
        receivers.map((receiver) => new Promise((resolve) => resolve(this.retryPublish(subject, receiver, tries))));
    }

    private getTopicReceivers(topic: string): Receiver[] {
        if (!this.receivers[topic]) {
            return [];
        }

        return this.receivers[topic];
    }

    private retryPublish(subject: Subject<any>, receiver: Receiver, triesLeft: number) {
        try {
            receiver.receive(subject);
        } catch (e) {
            console.log('error happened');

            // Here you can log fail
            triesLeft -= 1;

            if (triesLeft > 0) {
                this.retryPublish(subject, receiver, triesLeft);
            }
        }
    }

    public subscribe(topic: string, receiver: Receiver) {
        if (!this.receivers[topic]) {
            this.receivers[topic] = [];
        }

        this.receivers[topic].push(receiver);
    }

    public unsubscribe(topic: string, receiver: Receiver) {
        if (!this.receivers[topic]) {
            return;
        }

        this.receivers[topic] = this.receivers[topic].filter((item) => item !== receiver);
    }

    public unsubscribeAll(topic: string) {
        if (!this.receivers[topic]) {
            return;
        }

        delete this.receivers[topic];
    }
}
