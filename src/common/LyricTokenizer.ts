export const tokenize = (lineOfLyrics: string): string[] => {
    const matches = lineOfLyrics.match(/((\w|')+|[^\w'])/g);
    if (matches === null) {
        return [];
    }

    return matches;
};
