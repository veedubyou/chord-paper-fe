import { mapObjectKey } from "../../mapObject";
import { assertFound } from "./assert";
import { asDegree, asSemitone, Degree, Semitone } from "./Distance";

type NaturalNote = "C" | "D" | "E" | "F" | "G" | "A" | "B";

type FlatNote = `${NaturalNote}b`;
type SharpNote = `${NaturalNote}#`;
export type Note = NaturalNote | FlatNote | SharpNote;
export type NoteLetter = NaturalNote;

export const AllNotes: Record<Note, undefined> = {
    C: undefined,
    Cb: undefined,
    "C#": undefined,
    D: undefined,
    Db: undefined,
    "D#": undefined,
    E: undefined,
    Eb: undefined,
    "E#": undefined,
    F: undefined,
    Fb: undefined,
    "F#": undefined,
    G: undefined,
    Gb: undefined,
    "G#": undefined,
    A: undefined,
    Ab: undefined,
    "A#": undefined,
    B: undefined,
    Bb: undefined,
    "B#": undefined,
};

export const AllNoteLetters: NoteLetter[] = ["C", "D", "E", "F", "G", "A", "B"];

export const ChromaticNotes: Note[][] = [
    ["C", "B#"],
    ["Db", "C#"],
    ["D"],
    ["Eb", "D#"],
    ["E", "Fb"],
    ["F", "E#"],
    ["Gb", "F#"],
    ["G"],
    ["Ab", "G#"],
    ["A"],
    ["Bb", "A#"],
    ["B", "Cb"],
];

export const getNoteLetter = (note: Note): NoteLetter => {
    const letter = note.charAt(0) as NoteLetter;
    if (!AllNoteLetters.includes(letter)) {
        throw new Error("Note letter reduction function failed");
    }

    return letter;
};

export class NoteUtility {
    private note: Note;
    private chromaticNoteIndex: number;
    private noteLetter: NoteLetter;
    private noteLetterIndex: number;

    constructor(note: Note) {
        this.note = note;
        const chromaticNoteIndex = ChromaticNotes.findIndex(
            (enharmonics: Note[]) => enharmonics.includes(this.note)
        );
        assertFound(chromaticNoteIndex);
        this.chromaticNoteIndex = chromaticNoteIndex;

        this.noteLetter = getNoteLetter(note);

        const noteNameIndex = AllNoteLetters.findIndex(
            (elem: NoteLetter) => elem === this.noteLetter
        );
        assertFound(noteNameIndex);
        this.noteLetterIndex = noteNameIndex;
    }

    // returns enharmonic notes from some semitones above
    // e.g. 3 semitones from C is [D#, Eb]
    semitonesUp(semitones: Semitone): Note[] {
        const targetNoteIndex =
            (this.chromaticNoteIndex + semitones) % ChromaticNotes.length;

        return ChromaticNotes[targetNoteIndex];
    }

    // returns the amount of semitones between this note and the other
    // e.g. between C and Fb is 4 semitones
    semitonesBetween(otherNote: Note): Semitone {
        const otherNoteIndex = ChromaticNotes.findIndex((enharmonics: Note[]) =>
            enharmonics.includes(otherNote)
        );
        assertFound(otherNoteIndex);

        return asSemitone(otherNoteIndex - this.chromaticNoteIndex);
    }

    // returns whether this note and the other note is enharmonic
    // e.g. returns true for C# and Db, true for F and F, false for G and A
    isEnharmonicTo(otherNote: Note): boolean {
        return this.semitonesBetween(otherNote) === 0;
    }

    // returns the note name x many degrees above the current note name
    // e.g. 2 degrees above Cb is E, 2 degrees above B is D, etc.
    noteNameFrom(degree: Degree): NoteLetter {
        const targetNoteLetterIndex =
            (this.noteLetterIndex + degree) % AllNoteLetters.length;
        return AllNoteLetters[targetNoteLetterIndex];
    }

    // returns the unqualified degree between notes
    // e.g. between C and D is a second
    // but between Cb and D# is also a second
    degreesBetween(otherNote: Note): Degree {
        const otherNoteName = getNoteLetter(otherNote);
        const otherNoteNameIndex = AllNoteLetters.findIndex(
            (elem: NoteLetter) => elem === otherNoteName
        );
        assertFound(otherNoteNameIndex);

        return asDegree(otherNoteNameIndex - this.noteLetterIndex);
    }
}

export const NoteUtilities: Record<Note, NoteUtility> = mapObjectKey(
    AllNotes,
    (note: Note) => new NoteUtility(note)
);
