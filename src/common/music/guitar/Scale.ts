import { mapObjectKey } from "common/mapObject";
import { Importance } from "common/music/foundation/Importance";
import { AllStringNames, Fret, Fretboard, StringName } from "common/music/guitar/Fretboard";
import { Scale, ScaleNote } from "common/music/scale/Scale";

export type GuitarFretLabel = {
    fret: number;
    labelText: string;
    importance: Importance;
};

const getLabelText = (scaleNote: ScaleNote, labelType: "interval" | "note") => {
    switch (labelType) {
        case "interval": {
            return scaleNote.interval;
        }

        case "note": {
            return scaleNote.note;
        }
    }
};

export const generateGuitarScaleView = (
    scale: Scale,
    startingFret: number,
    endingFret: number,
    labelType: "interval" | "note"
): Record<StringName, GuitarFretLabel[]> => {
    const fretboardLabels: Record<StringName, GuitarFretLabel[]> = mapObjectKey(
        AllStringNames,
        () => []
    );

    for (const scaleNote of scale.notes) {
        const notePositions = Fretboard.getPositions(
            scaleNote.note,
            startingFret,
            endingFret
        );
        let stringName: StringName;
        for (stringName in notePositions) {
            const fretLabel = notePositions[stringName].map(
                (fret: Fret): GuitarFretLabel => ({
                    fret: fret.fret,
                    labelText: getLabelText(scaleNote, labelType),
                    importance: scaleNote.importance,
                })
            );

            fretboardLabels[stringName].push(...fretLabel);
        }
    }

    return fretboardLabels;
};
