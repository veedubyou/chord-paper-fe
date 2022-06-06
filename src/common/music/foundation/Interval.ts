import { mapObjectKey } from "common/mapObject";
import { asSemitone, Degree, Semitone } from "common/music/foundation/Distance";

type NaturalInterval = "1" | "2" | "3" | "4" | "5" | "6" | "7";
// a bit of a difference in nomenclature here
// in traditional music theory
// minor 2 is 2 with semitone down, and dim 2 is 2 with 2 semitones down
// minor 1 doesn't exist, but dim 1 is 1 with half step down
// we're going go treat perfect intervals like 1, 4, 5 like they could be 'minor'ed
// and diminished is 2 semitones down
type MinorInterval = `b${NaturalInterval}`;
type AugmentedInterval = `#${NaturalInterval}`;
type DoubleAugmentedInterval = `##${NaturalInterval}`;
type TripleAugmentedInterval = `###${"4"}`;
type DiminishedInterval = `bb${NaturalInterval}`;
type DoubleDiminishedInterval = `bbb${Exclude<NaturalInterval, "1" | "4">}`;

export type Interval =
    | NaturalInterval
    | MinorInterval
    | AugmentedInterval
    | DoubleAugmentedInterval
    | TripleAugmentedInterval
    | DiminishedInterval
    | DoubleDiminishedInterval;

export class IntervalUtility {
    interval: Interval;

    constructor(interval: Interval) {
        this.interval = interval;
    }

    get semitones(): Semitone {
        const naturalInterval = unqualifiedInterval(this.interval);
        let semitones = naturalIntervalToSemitone[naturalInterval];

        if (isInterval.minor(this.interval)) {
            semitones -= 1;
        } else if (isInterval.augmented(this.interval)) {
            semitones += 1;
        } else if (isInterval.doubleAugmented(this.interval)) {
            semitones += 2;
        } else if (isInterval.tripleAugmented(this.interval)) {
            semitones += 3;
        } else if (isInterval.diminished(this.interval)) {
            semitones -= 2;
        } else if (isInterval.doubleDiminished(this.interval)) {
            semitones -= 3;
        }

        return asSemitone(semitones);
    }

    get degree(): Degree {
        const unqualified = unqualifiedInterval(this.interval);
        return naturalIntervalToDegree[unqualified];
    }
}

export const findInterval = (semitones: Semitone, degree: Degree): Interval => {
    const naturalInterval = findNaturalIntervalByDegree(degree);
    const naturalSemitone = naturalIntervalToSemitone[naturalInterval];
    const semitoneDifference = asSemitone(semitones - naturalSemitone);

    if (semitoneDifference === asSemitone(0)) {
        return naturalInterval;
    }

    if (semitoneDifference === asSemitone(1)) {
        return `#${naturalInterval}`;
    }

    if (semitoneDifference === asSemitone(2)) {
        return `##${naturalInterval}`;
    }

    if (naturalInterval === "4" && semitoneDifference === asSemitone(3)) {
        return `###${naturalInterval}`;
    }

    if (semitoneDifference === asSemitone(-1)) {
        return `b${naturalInterval}`;
    }

    if (semitoneDifference === asSemitone(-2)) {
        return `bb${naturalInterval}`;
    }

    if (
        (naturalInterval === "2" ||
            naturalInterval === "3" ||
            naturalInterval === "5" ||
            naturalInterval === "6" ||
            naturalInterval === "7") &&
        semitoneDifference === asSemitone(-3)
    ) {
        return `bbb${naturalInterval}`;
    }

    throw new Error("No matching interval for semitone and number distance");
};

const naturalIntervalToSemitone: Record<NaturalInterval, Semitone> = {
    "1": 0,
    "2": 2,
    "3": 4,
    "4": 5,
    "5": 7,
    "6": 9,
    "7": 11,
};

const findNaturalIntervalByDegree = (degree: Degree): NaturalInterval => {
    let naturalInterval: NaturalInterval;
    for (naturalInterval in naturalIntervalToDegree) {
        if (naturalIntervalToDegree[naturalInterval] === degree) {
            return naturalInterval;
        }
    }

    throw new Error("Invalid number distance passed in");
};

const naturalIntervalToDegree: Record<NaturalInterval, Degree> = {
    "1": 0,
    "2": 1,
    "3": 2,
    "4": 3,
    "5": 4,
    "6": 5,
    "7": 6,
};

const naturalIntervals: Record<NaturalInterval, undefined> = {
    "1": undefined,
    "2": undefined,
    "3": undefined,
    "4": undefined,
    "5": undefined,
    "6": undefined,
    "7": undefined,
};

const minorIntervals: Record<MinorInterval, undefined> = {
    b1: undefined,
    b2: undefined,
    b3: undefined,
    b4: undefined,
    b5: undefined,
    b6: undefined,
    b7: undefined,
};

const augmentedIntervals: Record<AugmentedInterval, undefined> = {
    "#1": undefined,
    "#2": undefined,
    "#3": undefined,
    "#4": undefined,
    "#5": undefined,
    "#6": undefined,
    "#7": undefined,
};

const doubleAugmentedIntervals: Record<DoubleAugmentedInterval, undefined> = {
    "##1": undefined,
    "##2": undefined,
    "##3": undefined,
    "##4": undefined,
    "##5": undefined,
    "##6": undefined,
    "##7": undefined,
};

const tripleAugmentedIntervals: Record<TripleAugmentedInterval, undefined> = {
    "###4": undefined,
};

const diminishedIntervals: Record<DiminishedInterval, undefined> = {
    bb1: undefined,
    bb2: undefined,
    bb3: undefined,
    bb4: undefined,
    bb5: undefined,
    bb6: undefined,
    bb7: undefined,
};

const doubleDiminishedIntervals: Record<DoubleDiminishedInterval, undefined> = {
    bbb2: undefined,
    bbb3: undefined,
    bbb5: undefined,
    bbb6: undefined,
    bbb7: undefined,
};

export const AllIntervals: Record<Interval, undefined> = {
    ...naturalIntervals,
    ...minorIntervals,
    ...augmentedIntervals,
    ...diminishedIntervals,
    ...doubleAugmentedIntervals,
    ...doubleDiminishedIntervals,
    ...tripleAugmentedIntervals,
};

export const IntervalUtilities: Record<Interval, IntervalUtility> =
    mapObjectKey(
        AllIntervals,
        (interval: Interval) => new IntervalUtility(interval)
    );

const unqualifiedInterval = (interval: Interval): NaturalInterval => {
    return interval.charAt(interval.length - 1) as NaturalInterval;
};

const checkIntervalType = <T extends Interval>(
    interval: Interval,
    intervalSet: Record<T, undefined>
): interval is T => {
    for (const alteredInterval in intervalSet) {
        if (alteredInterval === interval) {
            return true;
        }
    }
    return false;
};

const isInterval = {
    minor: (interval: Interval): interval is MinorInterval =>
        checkIntervalType(interval, minorIntervals),

    augmented: (interval: Interval): interval is AugmentedInterval =>
        checkIntervalType(interval, augmentedIntervals),

    diminished: (interval: Interval): interval is DiminishedInterval =>
        checkIntervalType(interval, diminishedIntervals),

    doubleAugmented: (
        interval: Interval
    ): interval is DoubleAugmentedInterval =>
        checkIntervalType(interval, doubleAugmentedIntervals),

    doubleDiminished: (
        interval: Interval
    ): interval is DoubleDiminishedInterval =>
        checkIntervalType(interval, doubleDiminishedIntervals),

    tripleAugmented: (
        interval: Interval
    ): interval is TripleAugmentedInterval =>
        checkIntervalType(interval, tripleAugmentedIntervals),
};
