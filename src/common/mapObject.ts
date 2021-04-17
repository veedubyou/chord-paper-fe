type ValueOf<T> = T[keyof T];

type Dest<T, U> = {
    [P in keyof T]: U;
};

export function mapObject<T extends object, U>(
    source: T,
    transformFn: (value: ValueOf<T>, key: keyof T) => U
): {
    [P in keyof T]: U; // ugly to inline this, but this allows the type hints in VS Code to be more explicit
} {
    let dest = {} as Dest<T, U>;
    for (let key in source) {
        if (source.hasOwnProperty(key)) {
            const oldValue = source[key];
            dest[key] = transformFn(oldValue, key);
        }
    }
    return dest;
}
