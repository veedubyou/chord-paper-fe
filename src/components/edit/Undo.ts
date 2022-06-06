import { ChordSongAction } from "components/reducer/reducer";

export const handleUndoRedo = (
    event: KeyboardEvent,
    songDispatch: React.Dispatch<ChordSongAction>
): boolean => {
    const isSpecialKey = event.metaKey || event.ctrlKey;
    if (event.key !== "z" || !isSpecialKey) {
        return false;
    }

    if (event.shiftKey) {
        songDispatch({ type: "redo" });
    } else {
        songDispatch({ type: "undo" });
    }

    return true;
};
