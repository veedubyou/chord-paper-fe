import { MatcherFunction, within, waitFor } from "@testing-library/react";

// looks in all the descendents, finds all the qualifying elements
// for each qualifying node, return its text content
// and join all the children's text content together

const mergeText = (
    element: Element,
    shouldScanText: (element: Element) => boolean
): string | null => {
    if (shouldScanText(element)) {
        return element.textContent;
    }

    const childrenText: string[] = [];
    for (let i = 0; i < element.children.length; i++) {
        const child = element.children.item(i);
        if (child === null) {
            continue;
        }

        const childText = mergeText(child, shouldScanText);
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
    return mergeText(parentElement, (elem: Element): boolean => {
        return elem.getAttribute("data-testid") === "Lyric";
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

export const findByTestIdChain = async (
    findByTestId: (testID: string) => Promise<HTMLElement>,
    testIDChain: string[]
): Promise<HTMLElement> => {
    expect(testIDChain.length).toBeGreaterThanOrEqual(1);

    let parent: HTMLElement = await findByTestId(testIDChain[0]);
    for (let i = 1; i < testIDChain.length; i++) {
        parent = await within(parent).findByTestId(testIDChain[i]);
    }

    return parent;
};

function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export const expectChordAndLyric = async (
    findByTestId: (testID: string) => Promise<HTMLElement>,
    testIDChain: string[],
    chord: string,
    lyric: string
) => {
    const parent = await findByTestIdChain(findByTestId, testIDChain);

    const chordElem = await within(parent).findByTestId("Chord");
    const lyricElem = await within(parent).findByTestId("Lyric");

    await waitFor(() => {
        expect(chordElem).toHaveTextContent(chord, {
            normalizeWhitespace: true,
        });
    });
    await waitFor(() =>
        expect(lyricElem).toHaveTextContent(lyric, {
            normalizeWhitespace: true,
        })
    );
};
