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

export function min<T>(itr: Iterable<T>, compare?: (a: T, b: T) => number): T {
    const comparer = compare ? compare : defaultCompare;
    return chooseWithChooser(itr, (a, b) => comparer(a, b) < 0 ? a : b);
}

export function max<T>(itr: Iterable<T>, compare?: (a: T, b: T) => number): T {
    const comparer = compare ? compare : defaultCompare;
    return chooseWithChooser(itr, (a, b) => comparer(a, b) < 0 ? b : a);
}

export function any<T>(itr: Iterable<T>, predicate: (t: T) => boolean): boolean {
    return firstOrNull(itr, predicate) !== null;
}

function chooseWithChooser<T>(itr: Iterable<T>, choose: (a: T, b: T) => T): T {
    let current: T | null = null;

    for (const item of itr) {
        if (current === null) {
            current = item;
        }
        current = choose(current, item);
    }
    if (current === null) {
        throw new Error('empty iterable');
    }
    return current;
}

function defaultCompare<T>(a: T, b: T) {
    return a < b ? -1 : a > b ? 1 : 0;
}
