export class ArrayUtils {
    /** in-place shuffle */
    public static shuffle<T>(array: T[]) {
        // fisher-yates. copied from https://stackoverflow.com/a/6274398/2670469
        let i = array.length;

        while (i > 0) {
            const randIdx = Math.floor(Math.random() * i--);

            const temp = array[i];
            array[i] = array[randIdx];
            array[randIdx] = temp;
        }

        return array;
    }

    public static contains<T>(array: T[], item: T): boolean {
        return array.indexOf(item) !== -1;
    }
}
