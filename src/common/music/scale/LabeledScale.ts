import { Note } from "common/music/foundation/Note";
import { Scale } from "common/music/scale/Scale";

export type LabeledNote = {
    note: Note;
    label: string;
};

export interface LabeledScale extends Omit<Scale, "notes"> {
    labeledNotes: LabeledNote[];
}
