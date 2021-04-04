export function mockLoader<T>(data: T): () => Promise<T> {
    return () => new Promise((e) => e(data));
}
