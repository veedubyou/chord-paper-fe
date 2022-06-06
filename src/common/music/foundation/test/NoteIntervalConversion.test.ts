import { AllNotes, Note } from "common/music/foundation/Note";
import { IntervalToNote, NoteToInterval } from "common/music/foundation/NoteIntervalConversion";

describe("NoteIntervalConversion", () => {
    // note - the inverse test is expected to fail because it's higher resolution and the system
    // cannot adequately express every interval without double sharps and double flats
    // e.g.
    // IntervalToNote[C][bb1] === Bb because Cbb doesn't exist in the system
    // but of course, NoteToInterval[C][Bb] === b7
    test("NoteToInterval and IntervalToNote is bidirectionally equivalent", () => {
        let rootNote: Note;
        for (rootNote in AllNotes) {
            let otherNote: Note;
            for (otherNote in AllNotes) {
                const interval = NoteToInterval[rootNote][otherNote];
                const expectedOtherNote = IntervalToNote[rootNote][interval];

                expect(expectedOtherNote).toEqual(otherNote);
            }
        }
    });
});
