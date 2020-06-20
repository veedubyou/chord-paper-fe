export const DNDChordType: "chord" = "chord";

export interface DNDChord {
    type: typeof DNDChordType;
    chord: string;
}

export const NewDNDChord = (chord: string): DNDChord => {
    return {
        type: DNDChordType,
        chord: chord,
    };
};
