import { EventPublisher } from './event.publisher';
import { Receiver } from './receiver';
import { Subject } from './subject';

export class EventBus implements EventPublisher<Subject<any>> {
  receivers: {
    [key: string]: Receiver[];
  } = {};

  public async publish(subject: Subject<any>): Promise<void> {
    const receivers = this.getTopicReceivers(subject.topic);
    // Run promises
    receivers.forEach(receiver => new Promise(resolve => resolve(receiver.receive(subject))));
  }

  private getTopicReceivers(topic: string): Receiver[] {
    return this.receivers[topic] ?? [];
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
    this.receivers[topic] = this.receivers[topic].filter(item => item !== receiver);
  }

  public unsubscribeAll(topic: string) {
    if (!this.receivers[topic]) {
      return;
    }
    delete this.receivers[topic];
  }
}
