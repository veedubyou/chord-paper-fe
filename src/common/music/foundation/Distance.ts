// all possible distances in semitones for any interval or any 2 notes (modulo 12)
export type Semitone = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

// 0 indexed degrees
// all possible distances in numbers for any interval
// e.g. a 7th has a distance of 6 (7 - 1)
// this also doubles as the note name difference
// as a "second", e.g. C to D, necessarily implies that the lettering must change
export type Degree = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const checkWholeNumber = (val: number) => {
    if (val % 1 !== 0) {
        throw new Error("input isn't a whole number!");
    }
};

const modulo = (val: number, base: number): number => {
    return ((val % base) + base) % base;
};

export const asSemitone = (val: number): Semitone => {
    checkWholeNumber(val);
    return modulo(val, 12) as Semitone;
};

export const asDegree = (val: number): Degree => {
    checkWholeNumber(val);
    return modulo(val, 7) as Degree;
};
