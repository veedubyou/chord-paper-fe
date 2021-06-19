import { mapObjectKey } from "../../mapObject";
import { asSemitone } from "../foundation/Distance";
import { AllNotes, Note, NoteUtilities } from "../foundation/Note";

export type StringName = "E" | "A" | "D" | "G" | "B" | "highE";
export const AllStringNames: Record<StringName, undefined> = {
    highE: undefined,
    B: undefined,
    G: undefined,
    D: undefined,
    A: undefined,
    E: undefined,
};

type Fretmap = Record<Note, number[]>;

export type Fret = {
    fret: number;
    note: Note;
};

export type FretboardView = Record<StringName, Fret[]>;

class FretboardClass {
    static readonly maxFrets = 24;
    noteMap: Record<StringName, Fretmap>;

    static buildString(baseNote: Note): Fretmap {
        const fretmap: Fretmap = mapObjectKey(AllNotes, (): number[] => []);
        const noteUtility = NoteUtilities[baseNote];
        for (let i = 0; i <= FretboardClass.maxFrets; i++) {
            const nextNotes = noteUtility.semitonesUp(asSemitone(i));
            for (const note of nextNotes) {
                fretmap[note].push(i);
            }
        }

        return fretmap;
    }

    constructor() {
        this.noteMap = {
            highE: FretboardClass.buildString("E"),
            B: FretboardClass.buildString("B"),
            G: FretboardClass.buildString("G"),
            D: FretboardClass.buildString("D"),
            A: FretboardClass.buildString("A"),
            E: FretboardClass.buildString("E"),
        };
    }

    getPositions(
        note: Note,
        startingFret: number,
        endingFret: number
    ): FretboardView {
        const fretboardView: FretboardView = mapObjectKey(
            AllStringNames,
            () => []
        );

        let stringName: StringName;
        for (stringName in fretboardView) {
            const frets = this.noteMap[stringName][note];
            for (const fret of frets) {
                if (fret < startingFret || fret > endingFret) {
                    continue;
                }

                fretboardView[stringName].push({
                    fret: fret,
                    note: note,
                });
            }
        }

        return fretboardView;
    }
}

export const Fretboard = new FretboardClass();
