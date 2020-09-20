export const tokenize = (lineOfLyrics: string): string[] => {
    const matches = lineOfLyrics.match(/((<⑴>)|(<⑵>)|(<⑷>)|(\w|')+|[^\w'])/g);
    if (matches === null) {
        return [];
    }

    return matches;
};
