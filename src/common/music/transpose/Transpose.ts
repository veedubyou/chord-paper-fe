import { ChordSong } from "../../ChordModel/ChordSong";
import { AllNotes, Note } from "../foundation/Note";
import {
    IntervalToNote,
    NoteToInterval,
} from "../foundation/NoteIntervalConversion";

const transposeNote = (note: Note, fromKey: Note, toKey: Note): Note => {
    const interval = NoteToInterval[fromKey][note];

    return IntervalToNote[toKey][interval];
};

const transposeSymbol = (
    symbol: string,
    fromKey: Note,
    toKey: Note
): string => {
    const matchingNotes: Note[] = [];

    let note: Note;
    for (note in AllNotes) {
        if (symbol.startsWith(note)) {
            matchingNotes.push(note);
        }
    }

    if (matchingNotes.length === 0) {
        return symbol;
    }

    let matchingNote: Note = matchingNotes[0];
    for (const note of matchingNotes) {
        // use the longest matching note as the root
        // e.g. in C#7, C# is a better match than C
        if (note.length > matchingNote.length) {
            matchingNote = note;
        }
    }

    const transposedNote = transposeNote(matchingNote, fromKey, toKey);
    return symbol.replace(matchingNote, transposedNote);
};

const transposeChord = (chord: string, fromKey: Note, toKey: Note): string => {
    let bass: string | null = null;
    let baseChord: string = chord;
    if (chord.includes("/")) {
        const tokens = chord.split("/");
        baseChord = tokens[0];
        // we don't expect more than one slash, but just to be careful
        const remainingTokens = tokens.slice(1);
        bass = remainingTokens.join("/");
    }

    baseChord = transposeSymbol(baseChord, fromKey, toKey);
    if (bass === null) {
        return baseChord;
    }

    bass = transposeSymbol(bass, fromKey, toKey);
    return baseChord + "/" + bass;
};

export const transposeSong = (
    song: ChordSong,
    fromKey: Note,
    toKey: Note
): ChordSong => {
    for (const line of song.chordLines) {
        for (const block of line.chordBlocks) {
            if (block.chord === "") {
                continue;
            }

            block.chord = transposeChord(block.chord, fromKey, toKey);
        }
    }

    return song;
};
