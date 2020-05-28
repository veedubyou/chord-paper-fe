export const tokenize = (lineOfLyrics: string): string[] => {
    const matches = lineOfLyrics.match(/(\w+|\W)/g);
    if (matches === null) {
        return [];
    }

    return matches;
};

export const isWhitespace = (s: string): boolean => {
    return /\s/.test(s);
};
