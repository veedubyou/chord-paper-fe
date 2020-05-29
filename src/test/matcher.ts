import { MatcherFunction } from "@testing-library/react";

export const lyricsInElement = (element: Element): string | null => {
    const testid = element.getAttribute("data-testid");
    if (testid && testid.endsWith("-Lyric")) {
        return element.textContent;
    }

    const childrenLyrics: string[] = [];
    for (let i = 0; i < element.children.length; i++) {
        const child = element.children.item(i);
        if (child === null) {
            continue;
        }

        const childLyric = lyricsInElement(child);
        if (childLyric === null) {
            continue;
        }

        childrenLyrics.push(childLyric);
    }

    if (childrenLyrics.length == 0) {
        return null;
    }

    return childrenLyrics.join("");
};

export const matchLyric: (lyricToMatch: string) => MatcherFunction = (
    lyricToMatch: string
): MatcherFunction => {
    return (content: string, element: HTMLElement): boolean => {
        const hasLyrics = (element: Element) =>
            lyricsInElement(element) === lyricToMatch;
        const elementHasLyrics = hasLyrics(element);
        const childrenDontHaveLyrics = Array.from(element.children).every(
            (child) => !hasLyrics(child)
        );

        return elementHasLyrics && childrenDontHaveLyrics;
    };
};
