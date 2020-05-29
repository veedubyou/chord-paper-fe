export const isWhitespace = (s: string): boolean => {
    return /^\s+$/.test(s);
};

export const inflatingWhitespace = (): string => {
    return "\u00A0";
};

export const inflateIfEmpty = (value: string) => {
    if (isWhitespace(value)) {
        return inflatingWhitespace();
    }

    return value;
};
