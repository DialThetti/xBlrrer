export interface EventPublisher<T> {
    publish(subject: T, tries: number): Promise<void>;
}
