import { Key } from "./Keys";
import {
    ChromaticScale,
    getDifference,
    getNoteClass,
    moveUpSemitones,
    AllChromaticScale,
} from "./MusicNotes";
import { ChordSong } from "../ChordModel/ChordSong";

const transposeNote = (
    note: ChromaticScale,
    fromKey: Key,
    toKey: Key
): ChromaticScale => {
    const difference = getDifference(fromKey.Center, toKey.Center);
    const originalNoteClass = getNoteClass(note);
    const transposedNoteClass = moveUpSemitones(originalNoteClass, difference);
    return toKey[transposedNoteClass];
};

const transposeSymbol = (symbol: string, fromKey: Key, toKey: Key): string => {
    const matchingNotes: ChromaticScale[] = [];

    for (const scaleNote of AllChromaticScale) {
        if (symbol.startsWith(scaleNote)) {
            matchingNotes.push(scaleNote);
        }
    }

    if (matchingNotes.length === 0) {
        return symbol;
    }

    let matchingNote: ChromaticScale = matchingNotes[0];
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

const transposeChord = (chord: string, fromKey: Key, toKey: Key): string => {
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
    fromKey: Key,
    toKey: Key
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
