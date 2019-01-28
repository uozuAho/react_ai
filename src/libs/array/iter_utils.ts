export function* range(n: number): IterableIterator<number> {
    for (let i = 0; i < n; i++) { yield i; }
}

export function firstOrNull<T>(itr: Iterable<T>, predicate: (t: T) => boolean): T | null {
    for (const item of itr) {
        if (predicate(item)) {
            return item;
        }
    }
    return null;
}
