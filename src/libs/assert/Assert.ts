export class Assert {
    public static isTrue(expression: boolean, msg: string | null = null) {
        if (!expression) {
            msg = msg || 'Assertion failed';
            throw new Error(msg);
        }
    }
}
