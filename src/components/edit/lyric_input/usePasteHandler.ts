import { Lyric } from "../../../common/ChordModel/Lyric";
import { serializeLyrics } from "../../lyrics/Serialization";
import {
    insertNodeAtSelection,
    splitContentBySelection,
} from "./SelectionUtils";

type HandlerFn = (event: React.ClipboardEvent<HTMLDivElement>) => boolean;

const serializedLyricsFromRange = (range: Range): Lyric => {
    const documentFragment = range.cloneContents();
    return serializeLyrics(documentFragment.childNodes);
};

const composeMultilinePaste = (
    ref: React.RefObject<HTMLSpanElement>,
    pasteContent: string[]
): [Lyric, Lyric[]] => {
    const [beforeSelection, afterSelection] = splitContentBySelection(ref);

    let serializedLyricsForThisLine: Lyric =
        serializedLyricsFromRange(beforeSelection);

    serializedLyricsForThisLine = serializedLyricsForThisLine.append(
        pasteContent[0]
    );

    const newPasteLines = pasteContent.slice(1);
    const remainingSerializedLyrics: Lyric[] = newPasteLines.map(
        (line: string): Lyric => {
            return new Lyric(line);
        }
    );

    const lastIndex = remainingSerializedLyrics.length - 1;
    const lastLyric = remainingSerializedLyrics[lastIndex].append(
        serializedLyricsFromRange(afterSelection)
    );
    remainingSerializedLyrics[lastIndex] = lastLyric;

    return [serializedLyricsForThisLine, remainingSerializedLyrics];
};

const handlePlainTextPaste = (
    ref: React.RefObject<HTMLSpanElement>,
    callback: (firstLine: Lyric, restOfLines: Lyric[]) => void
): HandlerFn => {
    return (event: React.ClipboardEvent<HTMLDivElement>): boolean => {
        const payload = event.clipboardData.getData("text/plain");

        if (payload === "") {
            return false;
        }

        // handling both Windows + Mac
        let linesOfText: string[] = payload.split("\r\n");
        linesOfText = linesOfText.flatMap((line: string) => line.split("\n"));

        if (linesOfText.length === 0) {
            return false;
        }

        if (linesOfText.length === 1) {
            return insertNodeAtSelection(
                ref,
                document.createTextNode(linesOfText[0])
            );
        }

        const [newValue, newPasteLines] = composeMultilinePaste(
            ref,
            linesOfText
        );

        callback(newValue, newPasteLines);

        return true;
    };
};

const handleJSONPaste = (callback: (payload: string) => boolean): HandlerFn => {
    return (event: React.ClipboardEvent<HTMLDivElement>): boolean => {
        const payload = event.clipboardData.getData("application/json");

        if (payload === "") {
            return false;
        }

        return callback(payload);
    };
};

export interface PasteHandlerProps {
    contentEditableRef: React.RefObject<HTMLSpanElement>;
    pastePlainTextCallback: (firstLine: Lyric, restOfLines: Lyric[]) => void;
    pasteJSONCallback: (payload: string) => boolean;
}

export const usePasteHandler = (props: PasteHandlerProps) => {
    const handlers: HandlerFn[] = [
        handleJSONPaste(props.pasteJSONCallback),
        handlePlainTextPaste(
            props.contentEditableRef,
            props.pastePlainTextCallback
        ),
    ];

    return (event: React.ClipboardEvent<HTMLDivElement>) => {
        for (const handler of handlers) {
            const handled: boolean = handler(event);
            if (handled) {
                event.preventDefault();
                return;
            }
        }
    };
};
