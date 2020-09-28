import { Lyric } from "../../../common/ChordModel/Lyric";
import { PlainFn } from "../../../common/PlainFn";
import { serializeLyrics } from "../../lyrics/Serialization";
import {
    DomLyricTabFn,
    lyricTabTypeOfDOMNode,
    SizedTab,
    useDomLyricTab,
} from "../../lyrics/Tab";
import {
    insertNodeAtSelection,
    isSelectionAtBeginning,
    nodeBefore,
    splitContentBySelection,
} from "./SelectionUtils";

type HandlerFn = (event: React.KeyboardEvent<HTMLDivElement>) => boolean;

const enterHandler = (callback: PlainFn): HandlerFn => {
    return (event: React.KeyboardEvent<HTMLDivElement>): boolean => {
        if (event.key !== "Enter") {
            return false;
        }

        callback();
        return true;
    };
};

const specialBackspaceHandler = (
    ref: React.RefObject<HTMLSpanElement>,
    callback: PlainFn
): HandlerFn => {
    return (event: React.KeyboardEvent<HTMLDivElement>): boolean => {
        const specialBackspace: boolean =
            event.key === "Backspace" && (event.metaKey || event.ctrlKey);
        if (!specialBackspace) {
            return false;
        }

        if (!isSelectionAtBeginning(ref)) {
            return false;
        }

        callback();
        return true;
    };
};

const specialEnterHandler = (
    ref: React.RefObject<HTMLSpanElement>,
    callback: (beforeSelection: Lyric, afterSelection: Lyric) => void
): HandlerFn => {
    return (event: React.KeyboardEvent<HTMLSpanElement>): boolean => {
        const specialEnter: boolean =
            event.key === "Enter" && (event.metaKey || event.ctrlKey);
        if (!specialEnter) {
            return false;
        }

        const [beforeSelection, afterSelection] = splitContentBySelection(ref);

        const serializedLyricsBeforeSelection: Lyric = serializeLyrics(
            beforeSelection.cloneContents().childNodes
        );

        const serializedLyricsAfterSelection: Lyric = serializeLyrics(
            afterSelection.cloneContents().childNodes
        );

        callback(
            serializedLyricsBeforeSelection,
            serializedLyricsAfterSelection
        );

        return true;
    };
};

const tabHandler = (
    ref: React.RefObject<HTMLSpanElement>,
    domLyricTab: DomLyricTabFn
): HandlerFn => {
    return (event: React.KeyboardEvent<HTMLDivElement>): boolean => {
        if (event.key !== "Tab") {
            return false;
        }

        let sizedTab: SizedTab;

        if (event.shiftKey) {
            sizedTab = SizedTab.Size2Tab;
        } else {
            sizedTab = SizedTab.Size1Tab;
        }

        const domNode = domLyricTab(sizedTab);
        return insertNodeAtSelection(ref, domNode);
    };
};

const specialStylingKeysHandler = (): HandlerFn => {
    return (event: React.KeyboardEvent<HTMLDivElement>): boolean => {
        if (!event.metaKey && !event.ctrlKey) {
            return false;
        }

        // prevent bold, underline, or italics commands
        return (
            event.key === "b" ||
            event.key === "B" ||
            event.key === "u" ||
            event.key === "U" ||
            event.key === "i" ||
            event.key === "I"
        );
    };
};

const backspaceHandler = (ref: React.RefObject<HTMLSpanElement>) => {
    return (event: React.KeyboardEvent<HTMLDivElement>): boolean => {
        if (event.key !== "Backspace") {
            return false;
        }

        const node: Node | null = nodeBefore(ref);

        if (node === null || lyricTabTypeOfDOMNode(node) === null) {
            return false;
        }

        const parent = node.parentElement;
        if (parent === null) {
            return false;
        }

        parent.removeChild(node);
        return true;
    };
};

export interface KeyDownHandlerProps {
    contentEditableRef: React.RefObject<HTMLSpanElement>;
    enterCallback: PlainFn;
    specialBackspaceCallback: PlainFn;
    specialEnterCallback: (
        beforeSelection: Lyric,
        afterSelection: Lyric
    ) => void;
}

export const useKeyDownHandler = (props: KeyDownHandlerProps) => {
    const domLyricTab = useDomLyricTab();

    const handlers: HandlerFn[] = [
        specialEnterHandler(
            props.contentEditableRef,
            props.specialEnterCallback
        ),
        specialBackspaceHandler(
            props.contentEditableRef,
            props.specialBackspaceCallback
        ),
        tabHandler(props.contentEditableRef, domLyricTab),
        enterHandler(props.enterCallback),
        backspaceHandler(props.contentEditableRef),
        specialStylingKeysHandler(),
    ];

    return (event: React.KeyboardEvent<HTMLDivElement>) => {
        for (const handler of handlers) {
            const handled: boolean = handler(event);
            if (handled) {
                event.preventDefault();
                return;
            }
        }
    };
};
