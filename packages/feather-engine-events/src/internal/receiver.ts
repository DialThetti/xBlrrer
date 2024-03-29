import { Subject } from './subject';

export interface Receiver {
  receive(subject: Subject<any>): void;
}
