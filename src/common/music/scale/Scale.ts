import { mapObjectKey } from "../../mapObject";
import { Importance } from "../foundation/Importance";
import { Interval } from "../foundation/Interval";
import { AllNotes, Note } from "../foundation/Note";
import { IntervalToNote } from "../foundation/NoteIntervalConversion";

export type ScaleInterval = {
    interval: Interval;
    // the importance of the note should be determined by the chord context
    // but we may not always get that context
    importance: Importance;
};

export type ScaleNote = {
    note: Note;
    interval: Interval;
    importance: Importance;
};

export type ScaleType = ScaleInterval[];

export type ScaleName =
    | "Ionian"
    | "Dorian"
    | "Phrygian"
    | "Lydian"
    | "Mixolydian"
    | "Aeolian"
    | "Locrian"
    | "Dominant";

export const ScaleTypes: Record<ScaleName, ScaleType> = {
    // modes
    Lydian: [
        { interval: "1", importance: "root" },
        { interval: "2", importance: "normal" },
        { interval: "3", importance: "chordtone" },
        { interval: "#4", importance: "special" },
        { interval: "5", importance: "chordtone" },
        { interval: "6", importance: "normal" },
        { interval: "7", importance: "chordtone" },
    ],
    Ionian: [
        { interval: "1", importance: "root" },
        { interval: "2", importance: "normal" },
        { interval: "3", importance: "chordtone" },
        { interval: "4", importance: "normal" },
        { interval: "5", importance: "chordtone" },
        { interval: "6", importance: "normal" },
        { interval: "7", importance: "chordtone" },
    ],
    Mixolydian: [
        { interval: "1", importance: "root" },
        { interval: "2", importance: "normal" },
        { interval: "3", importance: "chordtone" },
        { interval: "4", importance: "normal" },
        { interval: "5", importance: "chordtone" },
        { interval: "6", importance: "normal" },
        { interval: "b7", importance: "chordtone" },
    ],
    Dorian: [
        { interval: "1", importance: "root" },
        { interval: "2", importance: "normal" },
        { interval: "b3", importance: "chordtone" },
        { interval: "4", importance: "normal" },
        { interval: "5", importance: "chordtone" },
        { interval: "6", importance: "special" },
        { interval: "b7", importance: "chordtone" },
    ],
    Aeolian: [
        { interval: "1", importance: "root" },
        { interval: "2", importance: "normal" },
        { interval: "b3", importance: "chordtone" },
        { interval: "4", importance: "normal" },
        { interval: "5", importance: "chordtone" },
        { interval: "b6", importance: "normal" },
        { interval: "b7", importance: "chordtone" },
    ],
    Phrygian: [
        { interval: "1", importance: "root" },
        { interval: "b2", importance: "special" },
        { interval: "b3", importance: "chordtone" },
        { interval: "4", importance: "normal" },
        { interval: "5", importance: "chordtone" },
        { interval: "b6", importance: "normal" },
        { interval: "b7", importance: "chordtone" },
    ],
    Locrian: [
        { interval: "1", importance: "root" },
        { interval: "b2", importance: "special" },
        { interval: "b3", importance: "chordtone" },
        { interval: "4", importance: "normal" },
        { interval: "b5", importance: "chordtone" },
        { interval: "b6", importance: "normal" },
        { interval: "b7", importance: "chordtone" },
    ],
    // dominant
    Dominant: [
        { interval: "1", importance: "root" },
        { interval: "b2", importance: "special" },
        { interval: "#2", importance: "special" },
        { interval: "3", importance: "chordtone" },
        { interval: "#4", importance: "special" },
        { interval: "b6", importance: "special" },
        { interval: "b7", importance: "chordtone" },
    ],
};

export type Scale = {
    center: Note;
    name: ScaleName;
    notes: ScaleNote[];
};
// scale mapping for all keys
export type ScaleCollection = Record<Note, Scale>;

const buildScaleCollection = (scaleName: ScaleName): ScaleCollection => {
    return mapObjectKey(AllNotes, (keyCenter: Note) =>
        buildScale(keyCenter, scaleName)
    );
};

const buildScale = (keyCenter: Note, scaleName: ScaleName): Scale => {
    const convertToScaleNote = (scaleInterval: ScaleInterval) => {
        return {
            note: IntervalToNote[keyCenter][scaleInterval.interval],
            interval: scaleInterval.interval,
            importance: scaleInterval.importance,
        };
    };

    const scaleNotes: ScaleNote[] =
        ScaleTypes[scaleName].map(convertToScaleNote);

    return {
        center: keyCenter,
        name: scaleName,
        notes: scaleNotes,
    };
};

export const AllScales: Record<ScaleName, ScaleCollection> = mapObjectKey(
    ScaleTypes,
    (scaleName: ScaleName) => buildScaleCollection(scaleName)
);

export class ScaleUtility {
    scale: Scale;
    constructor(scale: Scale) {
        this.scale = scale;
    }

    name(): string {
        return `${this.scale.center} ${this.scale.name}`;
    }
}
