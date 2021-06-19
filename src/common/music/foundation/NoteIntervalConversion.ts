// generating all intervals for all notes

import { mapObjectKey } from "../../mapObject";
import {
    AllIntervals,
    findInterval,
    Interval,
    IntervalUtility,
} from "./Interval";
import {
    NoteUtilities,
    AllNotes,
    getNoteLetter,
    Note,
    NoteLetter,
} from "./Note";

type IntervalToNoteMapping = Record<Interval, Note>;
type NoteToIntervalMapping = Record<Note, Interval>;

const intervalsToNotesOfRootNote = (rootNote: Note): IntervalToNoteMapping => {
    return mapObjectKey(AllIntervals, (interval: Interval) =>
        intervalToNote(rootNote, interval)
    );
};

const intervalToNote = (rootNote: Note, interval: Interval): Note => {
    const intervalProperties = new IntervalUtility(interval);
    const semitones = intervalProperties.semitones;
    const degree = intervalProperties.degree;

    const noteProperties = NoteUtilities[rootNote];
    const enharmonicTargetNotes: Note[] = noteProperties.semitonesUp(semitones);
    const targetNoteName: NoteLetter = noteProperties.noteNameFrom(degree);

    for (const targetNote of enharmonicTargetNotes) {
        if (getNoteLetter(targetNote) === targetNoteName) {
            return targetNote;
        }
    }

    return enharmonicTargetNotes[0];
};

const notesToIntervalsOfRootNote = (rootNote: Note): NoteToIntervalMapping => {
    return mapObjectKey(AllNotes, (note: Note) =>
        noteToInterval(rootNote, note)
    );
};

const noteToInterval = (rootNote: Note, otherNote: Note): Interval => {
    const rootNoteProperties = NoteUtilities[rootNote];

    const semitones = rootNoteProperties.semitonesBetween(otherNote);
    const degrees = rootNoteProperties.degreesBetween(otherNote);

    return findInterval(semitones, degrees);
};

export const IntervalToNote: Record<Note, IntervalToNoteMapping> = mapObjectKey(
    AllNotes,
    (rootNote: Note) => intervalsToNotesOfRootNote(rootNote)
);

export const NoteToInterval: Record<Note, NoteToIntervalMapping> = mapObjectKey(
    AllNotes,
    (rootNote: Note) => notesToIntervalsOfRootNote(rootNote)
);
