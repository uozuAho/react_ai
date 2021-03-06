export class IterUtils {
    public static* range(n: number): IterableIterator<number> {
        for (let i = 0; i < n; i++) { yield i; }
    }

    public static firstOrNull<T>(itr: Iterable<T>, predicate: (t: T) => boolean): T | null {
        for (const item of itr) {
            if (predicate(item)) {
                return item;
            }
        }
        return null;
    }

    public static min<T>(itr: Iterable<T>, compare?: (a: T, b: T) => number): T {
        const comparer = compare ? compare : this.defaultCompare;
        return this.chooseWithChooser(itr, (a, b) => comparer(a, b) < 0 ? a : b);
    }

    public static max<T>(itr: Iterable<T>, compare?: (a: T, b: T) => number): T {
        const comparer = compare ? compare : this.defaultCompare;
        return this.chooseWithChooser(itr, (a, b) => comparer(a, b) < 0 ? b : a);
    }

    public static any<T>(itr: Iterable<T>, predicate: (t: T) => boolean): boolean {
        return this.firstOrNull(itr, predicate) !== null;
    }

    public static sum(itr: Iterable<number>): number {
        let value = 0;
        for (const item of itr) {
            value += item;
        }
        return value;
    }

    public static* map<T1, T2>(itr: Iterable<T1>, f: (t: T1) => T2): Iterable<T2> {
        for (const item of itr) {
            yield f(item);
        }
    }

    public static* filter<T>(itr: Iterable<T>, f: (t: T) => boolean): Iterable<T> {
        for (const item of itr) {
            if (f(item)) {
                yield item;
            }
        }
    }

    private static chooseWithChooser<T>(itr: Iterable<T>, choose: (a: T, b: T) => T): T {
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

    private static defaultCompare<T>(a: T, b: T) {
        return a < b ? -1 : a > b ? 1 : 0;
    }
}
