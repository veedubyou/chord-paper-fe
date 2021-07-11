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
        if (!isTokenAttribute) {
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
    ...testIDChain: TestIDParam[]
) => Promise<HTMLElement>;

type FindAllByTestIdFn = (testID: string) => Promise<HTMLElement[]>;
export type TestIDParam = [string, number];

export const getFindByTestIdChain = (
    findAllByTestId: FindAllByTestIdFn
): FindByTestIdChainFn => {
    return async (...testIDChain: TestIDParam[]): Promise<HTMLElement> => {
        expect(testIDChain.length).toBeGreaterThanOrEqual(1);

        let parentsCollection: HTMLElement[] = await findAllByTestId(
            testIDChain[0][0]
        );
        let parent: HTMLElement = parentsCollection[testIDChain[0][1]];
        for (let i = 1; i < testIDChain.length; i++) {
            parentsCollection = await within(parent).findAllByTestId(
                testIDChain[i][0]
            );
            parent = parentsCollection[testIDChain[i][1]];
        }

        return parent;
    };
};

export type ExpectChordAndLyricFn = (
    chord: string,
    lyric: string,
    testIDChain: TestIDParam[]
) => Promise<void>;

export const getExpectChordAndLyric = (
    findAllByTestId: FindAllByTestIdFn
): ExpectChordAndLyricFn => {
    return async (
        expectedChord: string,
        expectedLyrics: string,
        testIDChain: TestIDParam[]
    ): Promise<void> => {
        const parent = await getFindByTestIdChain(findAllByTestId)(
            ...testIDChain
        );

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
