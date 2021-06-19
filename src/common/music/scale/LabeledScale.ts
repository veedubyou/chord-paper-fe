import { Note } from "../foundation/Note";
import { Scale } from "./Scale";

export type LabeledNote = {
    note: Note;
    label: string;
};

export interface LabeledScale extends Omit<Scale, "notes"> {
    labeledNotes: LabeledNote[];
}
