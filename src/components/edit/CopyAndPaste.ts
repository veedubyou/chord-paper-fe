import { Either, isLeft, left, parseJSON, right } from "fp-ts/lib/Either";
import { List } from "immutable";
import * as iots from "io-ts";
import { useSnackbar } from "notistack";
import {
    ChordLine,
    ChordLineValidatedFields,
    ChordLineValidator,
} from "../../common/ChordModel/ChordLine";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { getSelectedLineIDs } from "./LineSelection";

const CopiedChordLinesValidator = iots.type({
    copiedChordLines: iots.array(ChordLineValidator),
});

interface CopiedChordLines {
    copiedChordLines: ChordLine[];
}

export const deserializeCopiedChordLines = (
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

const serializeCopiedChordLines = (chordLines: List<ChordLine>): string => {
    const payload: CopiedChordLines = {
        copiedChordLines: chordLines.toArray(),
    };

    return JSON.stringify(payload);
};

export const useLineCopyHandler = (song: ChordSong) => {
    const { enqueueSnackbar } = useSnackbar();

    return (event: React.ClipboardEvent<HTMLDivElement>): boolean => {
        const lineIDs: string[] = getSelectedLineIDs();
        const lines: List<ChordLine> = song.chordLines.list.filter(
            (line: ChordLine): boolean => {
                return lineIDs.includes(line.id);
            }
        );

        if (lines.size === 0) {
            return false;
        }

        const serialized = serializeCopiedChordLines(lines);
        event.clipboardData.setData("application/json", serialized);

        event.preventDefault();

        let copyMsg: string;
        if (lines.size === 1) {
            copyMsg = `1 line copied to your clipboard`;
        } else {
            copyMsg = `${lines.size} lines copied to your clipboard`;
        }

        enqueueSnackbar(copyMsg, { variant: "info" });
        return true;
    };
};
