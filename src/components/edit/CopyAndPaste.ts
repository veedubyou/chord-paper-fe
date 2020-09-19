import {
    ChordLine,
    ChordLineValidator,
    ChordLineValidatedFields,
} from "../../common/ChordModel/ChordLine";
import * as iots from "io-ts";
import { Either, right, left, isLeft, parseJSON } from "fp-ts/lib/Either";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { IDable } from "../../common/ChordModel/Collection";
import { useSnackbar } from "notistack";

const CopiedChordLinesValidator = iots.type({
    copiedChordLines: iots.array(ChordLineValidator),
});

type CopiedChordLinesValidatedFields = iots.TypeOf<
    typeof CopiedChordLinesValidator
>;

interface CopiedChordLines {
    copiedChordLines: ChordLine[];
}

const deserializeCopiedChordLines = (
    jsonStr: string
): Either<Error, ChordLine[]> | null => {
    const result: Either<Error, unknown> = parseJSON(
        jsonStr,
        () => new Error("Failed to parse json string")
    );

    if (isLeft(result)) {
        return result;
    }

    const jsonObj = result.right as any;

    // if the JSON doesn't contain this field, then it's a JSON copy payload
    // from somewhere else - don't handle it
    if (jsonObj.copiedChordLines === undefined) {
        return null;
    }

    const validationResult = CopiedChordLinesValidator.decode(jsonObj);

    if (isLeft(validationResult)) {
        return left(new Error("Invalid Chord Lines payload"));
    }

    const validatedChordLineObjects = validationResult.right.copiedChordLines;
    const chordLines: ChordLine[] = validatedChordLineObjects.map(
        (obj: ChordLineValidatedFields) => {
            return ChordLine.fromValidatedFields(obj);
        }
    );

    return right(chordLines);
};

const serializeCopiedChordLines = (chordLines: ChordLine[]): string => {
    const payload: CopiedChordLines = {
        copiedChordLines: chordLines,
    };

    return JSON.stringify(payload);
};

enum RangePosition {
    START,
    END,
    MIDDLE,
}

const parentNode = (node: Node): Node => {
    if (node.parentNode === null) {
        throw new Error("Node doesn't have parent");
    }

    return node.parentNode;
};

const normalizeNodeBoundary = (
    container: Node,
    offset: number
): [Node, number] => {
    const position = getPositionForNode(container, offset);
    if (position === RangePosition.MIDDLE) {
        return [container, offset];
    }

    let offsetFromParent = findOffsetForNode(container);
    if (position === RangePosition.END) {
        offsetFromParent += 1;
    }

    return normalizeNodeBoundary(parentNode(container), offsetFromParent);
};

// ranges from selection tend to end up inside elements
// e.g. selecting line 2 might look like
// <div><div>line 1 |sel-start|</div></div>
// <div><div>line 2 |sel-end|</div></div>
// but what we really want is more like
// <div><div>line 1 </div></div>
// |sel-start|<div><div>line 2 </div></div>|sel-end|
// this function adjusts the boundaries of range by climbing up the DOM tree
// when the range boundary is at the start or end edge of an element
const normalizeRange = (range: Range) => {
    const [startContainer, startOffset] = normalizeNodeBoundary(
        range.startContainer,
        range.startOffset
    );
    const [endContainer, endOffset] = normalizeNodeBoundary(
        range.endContainer,
        range.endOffset
    );

    range.setStart(startContainer, startOffset);
    range.setEnd(endContainer, endOffset);
};

const getPositionForTextNode = (
    container: Node,
    offset: number
): RangePosition => {
    if (offset === 0) {
        return RangePosition.START;
    }

    const nodeValue: string | null = container.nodeValue;
    if (nodeValue === null) {
        throw new Error("Text node has no value?");
    }

    if (offset === nodeValue.length) {
        return RangePosition.END;
    }

    return RangePosition.MIDDLE;
};

const getPositionForElementNode = (
    container: Node,
    offset: number
): RangePosition => {
    const childNodes = container.childNodes;
    if (offset === 0) {
        return RangePosition.START;
    }

    if (offset === childNodes.length) {
        return RangePosition.END;
    }

    return RangePosition.MIDDLE;
};

const getPositionForNode = (container: Node, offset: number): RangePosition => {
    switch (container.nodeType) {
        case Node.TEXT_NODE: {
            return getPositionForTextNode(container, offset);
        }
        case Node.ELEMENT_NODE: {
            return getPositionForElementNode(container, offset);
        }

        default: {
            throw new Error("Crash for now " + container.nodeType);
        }
    }
};

const findOffsetForNode = (node: Node): number => {
    if (node.parentNode === null) {
        throw new Error("wtf");
    }

    const nodes = node.parentNode.childNodes;

    for (let i = 0; i < nodes.length; i++) {
        if (nodes.item(i) === node) {
            return i;
        }
    }

    throw new Error("Child node doesn't exist in parent???");
};

// selection can be represented as many discontiguous ranges, but that doesn't help us
// figure out whether a line is under selection or not.
// this utility function figures out a range that's the superset of all ranges in the selection
// with the start point as the earliest start point, and the end point as the latest end point
const getWideSelectionBoundary = (selection: Selection): Range => {
    const wideRange = document.createRange();
    const firstRange = selection.getRangeAt(0);
    wideRange.setStart(firstRange.startContainer, firstRange.startOffset);
    wideRange.setEnd(firstRange.endContainer, firstRange.endOffset);
    // selecting in the app can result in many dis

    for (let rangeIndex = 1; rangeIndex < selection.rangeCount; rangeIndex++) {
        const range = selection.getRangeAt(rangeIndex);

        if (
            range.compareBoundaryPoints(Range.START_TO_START, wideRange) === -1
        ) {
            wideRange.setStart(range.startContainer, range.startOffset);
        }

        if (range.compareBoundaryPoints(Range.END_TO_END, wideRange) === 1) {
            wideRange.setEnd(range.endContainer, range.endOffset);
        }
    }

    return wideRange;
};

const getSelectedLineIDs = (): string[] => {
    const selection: Selection | null = window.getSelection();
    if (selection === null || selection.rangeCount === 0) {
        return [];
    }

    const range = getWideSelectionBoundary(selection);
    normalizeRange(range);

    const lineElements = document.querySelectorAll("[data-lineid]");
    const lineIDs: string[] = [];

    for (
        let lineElementIndex = 0;
        lineElementIndex < lineElements.length;
        lineElementIndex++
    ) {
        const lineElement = lineElements.item(lineElementIndex);

        if (!range.intersectsNode(lineElement)) {
            continue;
        }

        const lineID: string | null = lineElement.getAttribute("data-lineid");
        if (lineID === null) {
            throw new Error(
                "Unexpected - line element should have line ID because that's how it was selected"
            );
        }

        lineIDs.push(lineID);
    }

    return lineIDs;
};

export const useLineCopyHandler = (song: ChordSong) => {
    const { enqueueSnackbar } = useSnackbar();

    return (event: React.ClipboardEvent<HTMLDivElement>): boolean => {
        const lineIDs: string[] = getSelectedLineIDs();
        const lines = song.chordLines.filter((line: ChordLine): boolean => {
            return lineIDs.includes(line.id);
        });

        if (lines.length === 0) {
            return false;
        }

        const serialized = serializeCopiedChordLines(lines);
        event.clipboardData.setData("application/json", serialized);

        event.preventDefault();

        let copyMsg: string;
        if (lines.length === 1) {
            copyMsg = `1 line copied to your clipboard`;
        } else {
            copyMsg = `${lines.length} lines copied to your clipboard`;
        }

        enqueueSnackbar(copyMsg, { variant: "info" });
        return true;
    };
};

export const useLinePasteHandler = (song: ChordSong) => {
    const { enqueueSnackbar } = useSnackbar();

    return (id: IDable<ChordLine>, jsonStr: string): boolean => {
        const deserializedCopyResult = deserializeCopiedChordLines(jsonStr);
        // not actually a Chord Paper line payload, don't handle it
        if (deserializedCopyResult === null) {
            return false;
        }

        if (isLeft(deserializedCopyResult)) {
            const errorMsg =
                "Failed to paste copied lines: " +
                deserializedCopyResult.left.message;
            enqueueSnackbar(errorMsg, { variant: "error" });
            return true;
        }

        const currLine: ChordLine = song.get(id);

        const copiedLines: ChordLine[] = deserializedCopyResult.right;
        song.addAfter(id, ...copiedLines);

        // if the line is empty, the user was probably trying to paste into the current line, and not the next
        // so just remove the current line to simulate that
        if (currLine.isEmpty()) {
            song.remove(id);
        }

        return true;
    };
};
