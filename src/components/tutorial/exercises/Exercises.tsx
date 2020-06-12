import EditChord from "./EditChord";
import RemoveChord from "./RemoveChord";
import AddChord from "./AddChord";
import EditLyrics from "./EditLyrics";
import ChordPositioning from "./ChordPositioning";
import AddLine from "./AddLine";
import RemoveLine from "./RemoveLine";
import PasteLyrics from "./PasteLyrics";
import MergeLine from "./MergeLine";

export type Exercise = {
    title: string;
    route: string;
    component: React.FC<{}>;
};

export const allExercises: Exercise[] = [
    {
        title: "Edit a Chord",
        route: "/learn/edit_chord",
        component: EditChord,
    },
    {
        title: "Remove a Chord",
        route: "/learn/remove_chord",
        component: RemoveChord,
    },
    {
        title: "Add a Chord",
        route: "/learn/add_chord",
        component: AddChord,
    },
    {
        title: "Edit Lyrics",
        route: "/learn/edit_lyrics",
        component: EditLyrics,
    },
    {
        title: "Chord Positioning",
        route: "/learn/chord_positioning",
        component: ChordPositioning,
    },
    {
        title: "Adding New Line",
        route: "/learn/add_line",
        component: AddLine,
    },
    {
        title: "Removing a Line",
        route: "/learn/remove_line",
        component: RemoveLine,
    },
    {
        title: "Pasting Lyrics",
        route: "/learn/paste_lyrics",
        component: PasteLyrics,
    },
    {
        title: "Merging Lines",
        route: "/learn/merge_lines",
        component: MergeLine,
    },
];

export default null;
