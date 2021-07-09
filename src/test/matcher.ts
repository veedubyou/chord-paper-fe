import { MatcherFunction, waitFor, within } from "@testing-library/react";
import { findTabType, lyricTabTypeOfDOMNode } from "../components/lyrics/Tab";

// looks in all the descendents, finds all the qualifying elements
// for each qualifying node, return its text content
// and join all the children's text content together

const mergeText = (
    element: Element,
    scanTextFn: (element: Element) => string | null
): string | null => {
    const result = scanTextFn(element);
    if (result !== null) {
        return result;
    }

    const childrenText: string[] = [];
    for (let i = 0; i < element.children.length; i++) {
        const child = element.children.item(i);
        if (child === null) {
            continue;
        }

        const childText = mergeText(child, scanTextFn);
        if (childText === null) {
            continue;
        }

        childrenText.push(childText);
    }

    if (childrenText.length == 0) {
        return null;
    }

    return childrenText.join("");
};

export const lyricsInElement = (parentElement: Element): string | null => {
    return mergeText(parentElement, (elem: Element): string | null => {
        const testID = elem.getAttribute("data-testid");
        if (testID === null) {
            return null;
        }

        const isTokenAttribute = testID.startsWith("Token-");
        if (!testID.startsWith("Token-")) {
            return null;
        }

        const firstElemChild = elem.firstElementChild;
        if (firstElemChild !== null) {
            const sizedTab = lyricTabTypeOfDOMNode(firstElemChild);
            if (sizedTab === null) {
                return null;
            }

            return findTabType("sizedTab", sizedTab).serializedStr;
        }

        return elem.textContent;
    });
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

export type FindByTestIdChainFn = (
    ...testIDChain: string[]
) => Promise<HTMLElement>;

export const getFindByTestIdChain = (
    findByTestId: (testID: string) => Promise<HTMLElement>
): ((...testIDChain: string[]) => Promise<HTMLElement>) => {
    return async (...testIDChain: string[]): Promise<HTMLElement> => {
        expect(testIDChain.length).toBeGreaterThanOrEqual(1);

        let parent: HTMLElement = await findByTestId(testIDChain[0]);
        for (let i = 1; i < testIDChain.length; i++) {
            parent = await within(parent).findByTestId(testIDChain[i]);
        }

        return parent;
    };
};

type FindByTestIdFn = (testID: string) => Promise<HTMLElement>;

export type ExpectChordAndLyricFn = (
    chord: string,
    lyric: string,
    testIDChain: string[]
) => Promise<void>;

export const getExpectChordAndLyric = (
    findByTestId: FindByTestIdFn
): ExpectChordAndLyricFn => {
    return async (
        expectedChord: string,
        expectedLyrics: string,
        testIDChain: string[]
    ): Promise<void> => {
        const parent = await getFindByTestIdChain(findByTestId)(...testIDChain);

        const chordElem = await within(parent).findByTestId("ChordSymbol");
        const lyricElem = await within(parent).findByTestId("Lyric");

        await waitFor(() => {
            expect(chordElem).toHaveTextContent(expectedChord, {
                normalizeWhitespace: true,
            });
        });
        await waitFor(() => {
            const lyrics = lyricsInElement(lyricElem);
            expect(lyrics).toEqual(expectedLyrics);
        });
    };
};
