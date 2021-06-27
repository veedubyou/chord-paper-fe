type ValueOf<T> = T[keyof T];

type Dest<T, U> = {
    [P in keyof T]: U;
};

export function mapObjectKey<T extends object, U>(
    source: T,
    transformFn: (key: keyof T) => U
): {
    [P in keyof T]: U; // ugly to inline this, but this allows the type hints in VS Code to be more explicit
} {
    return mapObject(
        source,
        (_value: ValueOf<T>, key: keyof T): U => transformFn(key)
    );
}
export function mapObject<T extends object, U>(
    source: T,
    transformFn: (value: ValueOf<T>, key: keyof T) => U
): {
    [P in keyof T]: U; // ugly to inline this, but this allows the type hints in VS Code to be more explicit
} {
    const dest = {} as Dest<T, U>;
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            const oldValue = source[key];
            dest[key] = transformFn(oldValue, key);
        }
    }
    return dest;
}
