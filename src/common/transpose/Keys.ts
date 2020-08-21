import { NoteClass, ChromaticScale } from "./MusicNotes";

export interface Key {
    Center: ChromaticScale;
    [NoteClass.C]: ChromaticScale.C | ChromaticScale.B_sharp;
    [NoteClass.Db]: ChromaticScale.Db | ChromaticScale.C_sharp;
    [NoteClass.D]: ChromaticScale.D;
    [NoteClass.Eb]: ChromaticScale.Eb | ChromaticScale.D_sharp;
    [NoteClass.E]: ChromaticScale.E | ChromaticScale.Fb;
    [NoteClass.F]: ChromaticScale.F | ChromaticScale.E_sharp;
    [NoteClass.Gb]: ChromaticScale.Gb | ChromaticScale.F_sharp;
    [NoteClass.G]: ChromaticScale.G;
    [NoteClass.Ab]: ChromaticScale.Ab | ChromaticScale.G_sharp;
    [NoteClass.A]: ChromaticScale.A;
    [NoteClass.Bb]: ChromaticScale.Bb | ChromaticScale.A_sharp;
    [NoteClass.B]: ChromaticScale.B | ChromaticScale.Cb;
}

const UnusableKeys = {
    // omitting B#, E#, and Fb
    // these set of keys are unusable
    [ChromaticScale.B_sharp]: null,
    [ChromaticScale.E_sharp]: null,
    [ChromaticScale.Fb]: null,
};

type UsableKeyCollection = {
    [ChromaticScale.C]: Key;
    [ChromaticScale.C_sharp]: Key;
    [ChromaticScale.Db]: Key;
    [ChromaticScale.D]: Key;
    [ChromaticScale.D_sharp]: Key;
    [ChromaticScale.Eb]: Key;
    [ChromaticScale.E]: Key;
    [ChromaticScale.F]: Key;
    [ChromaticScale.F_sharp]: Key;
    [ChromaticScale.Gb]: Key;
    [ChromaticScale.G]: Key;
    [ChromaticScale.G_sharp]: Key;
    [ChromaticScale.Ab]: Key;
    [ChromaticScale.A]: Key;
    [ChromaticScale.A_sharp]: Key;
    [ChromaticScale.Bb]: Key;
    [ChromaticScale.B]: Key;
    [ChromaticScale.Cb]: Key;
};

export const UsableKeys: UsableKeyCollection = {
    // all keys are expressed as 1, b2, 2, b3, 3, 4, #4, 5, b6, 6, b7, 7
    // since all accidentals are expressed as borrowing from another mode
    // this collection is valid for all modes except locrian
    //
    // exception when note has to be expressed as double sharp/flat, then it is just
    // the unqualified enharmonic for readability (e.g. b2 in Ab is Bbb, but we'll just write it as A since that's less complicated)

    [ChromaticScale.C]: {
        Center: ChromaticScale.C,
        [NoteClass.C]: ChromaticScale.C,
        [NoteClass.Db]: ChromaticScale.Db,
        [NoteClass.D]: ChromaticScale.D,
        [NoteClass.Eb]: ChromaticScale.Eb,
        [NoteClass.E]: ChromaticScale.E,
        [NoteClass.F]: ChromaticScale.F,
        [NoteClass.Gb]: ChromaticScale.F_sharp,
        [NoteClass.G]: ChromaticScale.G,
        [NoteClass.Ab]: ChromaticScale.Ab,
        [NoteClass.A]: ChromaticScale.A,
        [NoteClass.Bb]: ChromaticScale.Bb,
        [NoteClass.B]: ChromaticScale.B,
    },
    [ChromaticScale.C_sharp]: {
        Center: ChromaticScale.C_sharp,
        [NoteClass.Db]: ChromaticScale.C_sharp,
        [NoteClass.D]: ChromaticScale.D,
        [NoteClass.Eb]: ChromaticScale.D_sharp,
        [NoteClass.E]: ChromaticScale.E,
        [NoteClass.F]: ChromaticScale.E_sharp,
        [NoteClass.Gb]: ChromaticScale.F_sharp,
        [NoteClass.G]: ChromaticScale.G,
        [NoteClass.Ab]: ChromaticScale.G_sharp,
        [NoteClass.A]: ChromaticScale.A,
        [NoteClass.Bb]: ChromaticScale.A_sharp,
        [NoteClass.B]: ChromaticScale.B,
        [NoteClass.C]: ChromaticScale.B_sharp,
    },
    [ChromaticScale.Db]: {
        Center: ChromaticScale.Db,
        [NoteClass.Db]: ChromaticScale.Db,
        [NoteClass.D]: ChromaticScale.D,
        [NoteClass.Eb]: ChromaticScale.Eb,
        [NoteClass.E]: ChromaticScale.Fb,
        [NoteClass.F]: ChromaticScale.F,
        [NoteClass.Gb]: ChromaticScale.Gb,
        [NoteClass.G]: ChromaticScale.G,
        [NoteClass.Ab]: ChromaticScale.Ab,
        [NoteClass.A]: ChromaticScale.A,
        [NoteClass.Bb]: ChromaticScale.Bb,
        [NoteClass.B]: ChromaticScale.Cb,
        [NoteClass.C]: ChromaticScale.C,
    },
    [ChromaticScale.D]: {
        Center: ChromaticScale.D,
        [NoteClass.D]: ChromaticScale.D,
        [NoteClass.Eb]: ChromaticScale.Eb,
        [NoteClass.E]: ChromaticScale.E,
        [NoteClass.F]: ChromaticScale.F,
        [NoteClass.Gb]: ChromaticScale.F_sharp,
        [NoteClass.G]: ChromaticScale.G,
        [NoteClass.Ab]: ChromaticScale.G_sharp,
        [NoteClass.A]: ChromaticScale.A,
        [NoteClass.Bb]: ChromaticScale.Bb,
        [NoteClass.B]: ChromaticScale.B,
        [NoteClass.C]: ChromaticScale.C,
        [NoteClass.Db]: ChromaticScale.C_sharp,
    },
    [ChromaticScale.D_sharp]: {
        Center: ChromaticScale.D_sharp,
        [NoteClass.Eb]: ChromaticScale.D_sharp,
        [NoteClass.E]: ChromaticScale.E,
        [NoteClass.F]: ChromaticScale.E_sharp,
        [NoteClass.Gb]: ChromaticScale.F_sharp,
        [NoteClass.G]: ChromaticScale.G,
        [NoteClass.Ab]: ChromaticScale.G_sharp,
        [NoteClass.A]: ChromaticScale.A,
        [NoteClass.Bb]: ChromaticScale.A_sharp,
        [NoteClass.B]: ChromaticScale.B,
        [NoteClass.C]: ChromaticScale.B_sharp,
        [NoteClass.Db]: ChromaticScale.C_sharp,
        [NoteClass.D]: ChromaticScale.D,
    },
    [ChromaticScale.Eb]: {
        Center: ChromaticScale.Eb,
        [NoteClass.Eb]: ChromaticScale.Eb,
        [NoteClass.E]: ChromaticScale.Fb,
        [NoteClass.F]: ChromaticScale.F,
        [NoteClass.Gb]: ChromaticScale.Gb,
        [NoteClass.G]: ChromaticScale.G,
        [NoteClass.Ab]: ChromaticScale.Ab,
        [NoteClass.A]: ChromaticScale.A,
        [NoteClass.Bb]: ChromaticScale.Bb,
        [NoteClass.B]: ChromaticScale.Cb,
        [NoteClass.C]: ChromaticScale.C,
        [NoteClass.Db]: ChromaticScale.Db,
        [NoteClass.D]: ChromaticScale.D,
    },
    [ChromaticScale.E]: {
        Center: ChromaticScale.E,
        [NoteClass.E]: ChromaticScale.E,
        [NoteClass.F]: ChromaticScale.F,
        [NoteClass.Gb]: ChromaticScale.F_sharp,
        [NoteClass.G]: ChromaticScale.G,
        [NoteClass.Ab]: ChromaticScale.G_sharp,
        [NoteClass.A]: ChromaticScale.A,
        [NoteClass.Bb]: ChromaticScale.A_sharp,
        [NoteClass.B]: ChromaticScale.B,
        [NoteClass.C]: ChromaticScale.C,
        [NoteClass.Db]: ChromaticScale.C_sharp,
        [NoteClass.D]: ChromaticScale.D,
        [NoteClass.Eb]: ChromaticScale.D_sharp,
    },
    [ChromaticScale.F]: {
        Center: ChromaticScale.F,
        [NoteClass.F]: ChromaticScale.F,
        [NoteClass.Gb]: ChromaticScale.Gb,
        [NoteClass.G]: ChromaticScale.G,
        [NoteClass.Ab]: ChromaticScale.Ab,
        [NoteClass.A]: ChromaticScale.A,
        [NoteClass.Bb]: ChromaticScale.Bb,
        [NoteClass.B]: ChromaticScale.B,
        [NoteClass.C]: ChromaticScale.C,
        [NoteClass.Db]: ChromaticScale.Db,
        [NoteClass.D]: ChromaticScale.D,
        [NoteClass.Eb]: ChromaticScale.Eb,
        [NoteClass.E]: ChromaticScale.E,
    },
    [ChromaticScale.F_sharp]: {
        Center: ChromaticScale.F_sharp,
        [NoteClass.Gb]: ChromaticScale.F_sharp,
        [NoteClass.G]: ChromaticScale.G,
        [NoteClass.Ab]: ChromaticScale.G_sharp,
        [NoteClass.A]: ChromaticScale.A,
        [NoteClass.Bb]: ChromaticScale.A_sharp,
        [NoteClass.B]: ChromaticScale.B,
        [NoteClass.C]: ChromaticScale.B_sharp,
        [NoteClass.Db]: ChromaticScale.C_sharp,
        [NoteClass.D]: ChromaticScale.D,
        [NoteClass.Eb]: ChromaticScale.D_sharp,
        [NoteClass.E]: ChromaticScale.E,
        [NoteClass.F]: ChromaticScale.E_sharp,
    },
    [ChromaticScale.Gb]: {
        Center: ChromaticScale.Gb,
        [NoteClass.Gb]: ChromaticScale.Gb,
        [NoteClass.G]: ChromaticScale.G,
        [NoteClass.Ab]: ChromaticScale.Ab,
        [NoteClass.A]: ChromaticScale.A,
        [NoteClass.Bb]: ChromaticScale.Bb,
        [NoteClass.B]: ChromaticScale.Cb,
        [NoteClass.C]: ChromaticScale.C,
        [NoteClass.Db]: ChromaticScale.Db,
        [NoteClass.D]: ChromaticScale.D,
        [NoteClass.Eb]: ChromaticScale.Eb,
        [NoteClass.E]: ChromaticScale.Fb,
        [NoteClass.F]: ChromaticScale.F,
    },
    [ChromaticScale.G]: {
        Center: ChromaticScale.G,
        [NoteClass.G]: ChromaticScale.G,
        [NoteClass.Ab]: ChromaticScale.Ab,
        [NoteClass.A]: ChromaticScale.A,
        [NoteClass.Bb]: ChromaticScale.Bb,
        [NoteClass.B]: ChromaticScale.B,
        [NoteClass.C]: ChromaticScale.C,
        [NoteClass.Db]: ChromaticScale.C_sharp,
        [NoteClass.D]: ChromaticScale.D,
        [NoteClass.Eb]: ChromaticScale.Eb,
        [NoteClass.E]: ChromaticScale.E,
        [NoteClass.F]: ChromaticScale.F,
        [NoteClass.Gb]: ChromaticScale.F_sharp,
    },
    [ChromaticScale.G_sharp]: {
        Center: ChromaticScale.G_sharp,
        [NoteClass.Ab]: ChromaticScale.G_sharp,
        [NoteClass.A]: ChromaticScale.A,
        [NoteClass.Bb]: ChromaticScale.A_sharp,
        [NoteClass.B]: ChromaticScale.B,
        [NoteClass.C]: ChromaticScale.B_sharp,
        [NoteClass.Db]: ChromaticScale.C_sharp,
        [NoteClass.D]: ChromaticScale.D,
        [NoteClass.Eb]: ChromaticScale.D_sharp,
        [NoteClass.E]: ChromaticScale.E,
        [NoteClass.F]: ChromaticScale.E_sharp,
        [NoteClass.Gb]: ChromaticScale.F_sharp,
        [NoteClass.G]: ChromaticScale.G,
    },
    [ChromaticScale.Ab]: {
        Center: ChromaticScale.Ab,
        [NoteClass.Ab]: ChromaticScale.Ab,
        [NoteClass.A]: ChromaticScale.A,
        [NoteClass.Bb]: ChromaticScale.Bb,
        [NoteClass.B]: ChromaticScale.Cb,
        [NoteClass.C]: ChromaticScale.C,
        [NoteClass.Db]: ChromaticScale.Db,
        [NoteClass.D]: ChromaticScale.D,
        [NoteClass.Eb]: ChromaticScale.Eb,
        [NoteClass.E]: ChromaticScale.Fb,
        [NoteClass.F]: ChromaticScale.F,
        [NoteClass.Gb]: ChromaticScale.Gb,
        [NoteClass.G]: ChromaticScale.G,
    },
    [ChromaticScale.A]: {
        Center: ChromaticScale.A,
        [NoteClass.A]: ChromaticScale.A,
        [NoteClass.Bb]: ChromaticScale.Bb,
        [NoteClass.B]: ChromaticScale.B,
        [NoteClass.C]: ChromaticScale.C,
        [NoteClass.Db]: ChromaticScale.C_sharp,
        [NoteClass.D]: ChromaticScale.D,
        [NoteClass.Eb]: ChromaticScale.D_sharp,
        [NoteClass.E]: ChromaticScale.E,
        [NoteClass.F]: ChromaticScale.F,
        [NoteClass.Gb]: ChromaticScale.F_sharp,
        [NoteClass.G]: ChromaticScale.G,
        [NoteClass.Ab]: ChromaticScale.G_sharp,
    },
    [ChromaticScale.A_sharp]: {
        Center: ChromaticScale.A_sharp,
        [NoteClass.Bb]: ChromaticScale.A_sharp,
        [NoteClass.B]: ChromaticScale.B,
        [NoteClass.C]: ChromaticScale.B_sharp,
        [NoteClass.Db]: ChromaticScale.C_sharp,
        [NoteClass.D]: ChromaticScale.D,
        [NoteClass.Eb]: ChromaticScale.D_sharp,
        [NoteClass.E]: ChromaticScale.E,
        [NoteClass.F]: ChromaticScale.E_sharp,
        [NoteClass.Gb]: ChromaticScale.F_sharp,
        [NoteClass.G]: ChromaticScale.G,
        [NoteClass.Ab]: ChromaticScale.G_sharp,
        [NoteClass.A]: ChromaticScale.A,
    },
    [ChromaticScale.Bb]: {
        Center: ChromaticScale.Bb,
        [NoteClass.Bb]: ChromaticScale.Bb,
        [NoteClass.B]: ChromaticScale.Cb,
        [NoteClass.C]: ChromaticScale.C,
        [NoteClass.Db]: ChromaticScale.Db,
        [NoteClass.D]: ChromaticScale.D,
        [NoteClass.Eb]: ChromaticScale.Eb,
        [NoteClass.E]: ChromaticScale.E,
        [NoteClass.F]: ChromaticScale.F,
        [NoteClass.Gb]: ChromaticScale.Gb,
        [NoteClass.G]: ChromaticScale.G,
        [NoteClass.Ab]: ChromaticScale.Ab,
        [NoteClass.A]: ChromaticScale.A,
    },
    [ChromaticScale.B]: {
        Center: ChromaticScale.B,
        [NoteClass.B]: ChromaticScale.B,
        [NoteClass.C]: ChromaticScale.C,
        [NoteClass.Db]: ChromaticScale.C_sharp,
        [NoteClass.D]: ChromaticScale.D,
        [NoteClass.Eb]: ChromaticScale.D_sharp,
        [NoteClass.E]: ChromaticScale.E,
        [NoteClass.F]: ChromaticScale.E_sharp,
        [NoteClass.Gb]: ChromaticScale.F_sharp,
        [NoteClass.G]: ChromaticScale.G,
        [NoteClass.Ab]: ChromaticScale.G_sharp,
        [NoteClass.A]: ChromaticScale.A,
        [NoteClass.Bb]: ChromaticScale.A_sharp,
    },
    [ChromaticScale.Cb]: {
        Center: ChromaticScale.Cb,
        [NoteClass.B]: ChromaticScale.Cb,
        [NoteClass.C]: ChromaticScale.C,
        [NoteClass.Db]: ChromaticScale.Db,
        [NoteClass.D]: ChromaticScale.D,
        [NoteClass.Eb]: ChromaticScale.Eb,
        [NoteClass.E]: ChromaticScale.Fb,
        [NoteClass.F]: ChromaticScale.F,
        [NoteClass.Gb]: ChromaticScale.Gb,
        [NoteClass.G]: ChromaticScale.G,
        [NoteClass.Ab]: ChromaticScale.Ab,
        [NoteClass.A]: ChromaticScale.A,
        [NoteClass.Bb]: ChromaticScale.Bb,
    },
};

// sanity check to make sure all keys are covered
// not for actual usage, but to make sure it compiles
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const allKeys: {
    [P in ChromaticScale]: Key | null;
} = {
    ...UsableKeys,
    ...UnusableKeys,
};

const {
    [ChromaticScale.D_sharp]: _a1,
    [ChromaticScale.A_sharp]: _a2,
    [ChromaticScale.G_sharp]: _a3,
    ...UsableMajorKeys
} = UsableKeys;
export const MajorKeys = UsableMajorKeys;

export const isMajorKey = (
    key: ChromaticScale
): key is keyof typeof MajorKeys => {
    return key in MajorKeys;
};

const {
    [ChromaticScale.Db]: _b1,
    [ChromaticScale.Gb]: _b2,
    [ChromaticScale.Cb]: _b3,
    ...UsableMinorKeys
} = UsableKeys;
export const MinorKeys = UsableMinorKeys;

export const isMinorKey = (
    key: ChromaticScale
): key is keyof typeof MinorKeys => {
    return key in MinorKeys;
};
