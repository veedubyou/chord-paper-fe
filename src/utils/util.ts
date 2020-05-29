export const tokenize = (lineOfLyrics: string): string[] => {
    const matches = lineOfLyrics.match(/(\w+|\W)/g);
    if (matches === null) {
        return [];
    }

    return matches;
};

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
