import { SerializedLyrics } from "./LyricSerialization";

export const tokenize = (lineOfLyrics: SerializedLyrics): string[] => {
    const matches = lineOfLyrics.serializedLyrics.match(
        /((<⑴>)|(<⑵>)|(<⑷>)|(\w|')+|[^\w'])/g
    );
    if (matches === null) {
        return [];
    }

    return matches;
};
