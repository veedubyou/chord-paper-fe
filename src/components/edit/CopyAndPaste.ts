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
import { getSelectedLineIDs } from "./LineSelection";

const CopiedChordLinesValidator = iots.type({
    copiedChordLines: iots.array(ChordLineValidator),
});

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
