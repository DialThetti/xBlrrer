import { EventPublisher } from './event.publisher';
import { Subject } from './subject';

export class EventStack implements EventPublisher<Subject<any>> {
    private eventStack: { [topic: string]: Subject<any>[] } = {};

    public async publish(subject: Subject<any>): Promise<void> {
        if (!this.eventStack[subject.topic]) {
            this.eventStack[subject.topic] = [];
        }
        this.eventStack[subject.topic].push(subject);
    }

    public process(topic: string, f: (s: Subject<any>) => void): void {
        if (!this.eventStack[topic]) {
            return;
        }
        this.eventStack[topic].forEach(f);
        delete this.eventStack[topic];
    }
}
