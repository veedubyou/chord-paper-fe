// all possible expression of notes
// except quarter tunings
// and double sharps and double flats
export enum ChromaticScale {
    C = "C",
    C_sharp = "C#",
    Db = "Db",
    D = "D",
    D_sharp = "D#",
    Eb = "Eb",
    E = "E",
    Fb = "Fb",
    E_sharp = "E#",
    F = "F",
    F_sharp = "F#",
    Gb = "Gb",
    G = "G",
    G_sharp = "G#",
    Ab = "Ab",
    A = "A",
    A_sharp = "A#",
    Bb = "Bb",
    B = "B",
    Cb = "Cb",
    B_sharp = "B#",
}

// no good way to enumerate all values of an enum in TS
// and keep type safety. this isn't expected to change so it should be stable
export const AllChromaticScale: ChromaticScale[] = [
    ChromaticScale.C,
    ChromaticScale.C_sharp,
    ChromaticScale.Db,
    ChromaticScale.D,
    ChromaticScale.D_sharp,
    ChromaticScale.Eb,
    ChromaticScale.E,
    ChromaticScale.Fb,
    ChromaticScale.E_sharp,
    ChromaticScale.F,
    ChromaticScale.F_sharp,
    ChromaticScale.Gb,
    ChromaticScale.G,
    ChromaticScale.G_sharp,
    ChromaticScale.Ab,
    ChromaticScale.A,
    ChromaticScale.A_sharp,
    ChromaticScale.Bb,
    ChromaticScale.B,
    ChromaticScale.Cb,
    ChromaticScale.B_sharp,
];

// flattened representation of the 12 note scale
// everything represented as flats so that I don't have to add any
// C_sharp like enums
export enum NoteClass {
    C,
    Db,
    D,
    Eb,
    E,
    F,
    Gb,
    G,
    Ab,
    A,
    Bb,
    B,
}

const noteClassCount = 12;

type NoteMapping = {
    [P in ChromaticScale]: NoteClass;
};

const mapping: NoteMapping = {
    // naturals
    [ChromaticScale.C]: NoteClass.C,
    [ChromaticScale.D]: NoteClass.D,
    [ChromaticScale.E]: NoteClass.E,
    [ChromaticScale.F]: NoteClass.F,
    [ChromaticScale.G]: NoteClass.G,
    [ChromaticScale.A]: NoteClass.A,
    [ChromaticScale.B]: NoteClass.B,
    // flats
    [ChromaticScale.Cb]: NoteClass.B,
    [ChromaticScale.Db]: NoteClass.Db,
    [ChromaticScale.Eb]: NoteClass.Eb,
    [ChromaticScale.Fb]: NoteClass.E,
    [ChromaticScale.Gb]: NoteClass.Gb,
    [ChromaticScale.Ab]: NoteClass.Ab,
    [ChromaticScale.Bb]: NoteClass.Bb,
    // sharps
    [ChromaticScale.C_sharp]: NoteClass.Db,
    [ChromaticScale.D_sharp]: NoteClass.Eb,
    [ChromaticScale.E_sharp]: NoteClass.F,
    [ChromaticScale.F_sharp]: NoteClass.Gb,
    [ChromaticScale.G_sharp]: NoteClass.Ab,
    [ChromaticScale.A_sharp]: NoteClass.Bb,
    [ChromaticScale.B_sharp]: NoteClass.C,
};

export const getNoteClass = (note: ChromaticScale): NoteClass => {
    return mapping[note];
};

export const getDifference = (
    from: ChromaticScale,
    to: ChromaticScale
): number => {
    const fromNoteClass = getNoteClass(from);
    const toNoteClass = getNoteClass(to);
    let diff = toNoteClass - fromNoteClass;
    if (diff < 0) {
        diff += noteClassCount;
    }

    return diff;
};

export const moveUpSemitones = (note: NoteClass, moveBy: number): NoteClass => {
    return (note + moveBy) % noteClassCount;
};
