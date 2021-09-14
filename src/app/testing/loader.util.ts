export function mockLoader<T>(data: T): () => Promise<T> {
    return () => Promise.resolve(data);
}
