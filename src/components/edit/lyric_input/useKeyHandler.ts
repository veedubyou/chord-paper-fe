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
    childIndex,
    contentEditableElement,
    insertNodeAtSelection,
    isSelectionAtBeginning,
    nodeAfterSelection,
    nodeBeforeSelection,
    splitContentBySelection,
} from "./SelectionUtils";

type ContentEditableElement = HTMLSpanElement;
type HandlerFn = (
    event: React.KeyboardEvent<ContentEditableElement>
) => boolean;

const enterHandler = (callback: PlainFn): HandlerFn => {
    return (event: React.KeyboardEvent<ContentEditableElement>): boolean => {
        if (event.key !== "Enter") {
            return false;
        }

        callback();
        return true;
    };
};

const specialBackspaceHandler = (
    ref: React.RefObject<ContentEditableElement>,
    callback: PlainFn
): HandlerFn => {
    return (event: React.KeyboardEvent<ContentEditableElement>): boolean => {
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
    ref: React.RefObject<ContentEditableElement>,
    callback: (beforeSelection: Lyric, afterSelection: Lyric) => void
): HandlerFn => {
    return (event: React.KeyboardEvent<ContentEditableElement>): boolean => {
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
    ref: React.RefObject<ContentEditableElement>,
    domLyricTab: DomLyricTabFn
): HandlerFn => {
    return (event: React.KeyboardEvent<ContentEditableElement>): boolean => {
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
    return (event: React.KeyboardEvent<ContentEditableElement>): boolean => {
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

const backspaceHandler = (ref: React.RefObject<ContentEditableElement>) => {
    return (event: React.KeyboardEvent<ContentEditableElement>): boolean => {
        if (event.key !== "Backspace") {
            return false;
        }

        const node: Node | null = nodeBeforeSelection(ref);

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

const directionKeyHandler = (ref: React.RefObject<ContentEditableElement>) => {
    return (event: React.KeyboardEvent<ContentEditableElement>): boolean => {
        const elem = contentEditableElement(ref);
        const selection = window.getSelection();

        if (selection === null) {
            return false;
        }

        if (event.shiftKey || event.metaKey || event.ctrlKey) {
            return false;
        }

        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
            return false;
        }

        let nodeIndex: number;

        if (event.key === "ArrowLeft") {
            const node: Node | null = nodeBeforeSelection(ref);
            if (node === null || lyricTabTypeOfDOMNode(node) === null) {
                return false;
            }

            const childNodeIndex = childIndex(elem, node);
            if (childNodeIndex === null) {
                console.error(
                    "Unexpected - node cannot be found inside contenteditable element"
                );
                return false;
            }

            // navigate to before this node by setting the selection offset to this node index

            nodeIndex = childNodeIndex;
        } else {
            // ArrowRight
            const node: Node | null = nodeAfterSelection(ref);
            if (node === null || lyricTabTypeOfDOMNode(node) === null) {
                return false;
            }

            const childNodeIndex = childIndex(elem, node);
            if (childNodeIndex === null) {
                console.error(
                    "Unexpected - node cannot be found inside contenteditable element"
                );
                return false;
            }

            // navigate to before this node by setting the selection offset to this node index
            nodeIndex = childNodeIndex + 1;
        }

        selection.setBaseAndExtent(elem, nodeIndex, elem, nodeIndex);

        return true;
    };
};

export interface KeyDownHandlerProps {
    contentEditableRef: React.RefObject<ContentEditableElement>;
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
        directionKeyHandler(props.contentEditableRef),
        specialStylingKeysHandler(),
    ];

    return (event: React.KeyboardEvent<ContentEditableElement>) => {
        setTimeout(() => {
            const selection = document.getSelection();
            if (selection !== null) {
                const range = selection.getRangeAt(0);
                console.log(range.startContainer);
                console.log(range.startOffset);
                console.log(range.endOffset);
            }
        }, 100);

        for (const handler of handlers) {
            const handled: boolean = handler(event);
            if (handled) {
                event.preventDefault();
                return;
            }
        }
    };
};
