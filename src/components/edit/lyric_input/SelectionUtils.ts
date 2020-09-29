export const contentEditableElement = (
    contentEditableRef: React.RefObject<HTMLSpanElement>
): HTMLSpanElement => {
    if (contentEditableRef.current === null) {
        throw new Error("unexpected for ref to be null");
    }

    return contentEditableRef.current;
};

export const selectionRange = (
    ref: React.RefObject<HTMLSpanElement>
): Range | null => {
    const node = contentEditableElement(ref);

    const selection = window.getSelection();
    if (selection === null || selection.rangeCount === 0) {
        return null;
    }

    const range = selection.getRangeAt(0);
    if (
        range === null ||
        !node.contains(range.startContainer) ||
        !node.contains(range.endContainer)
    ) {
        return null;
    }

    return range;
};

export const isSelectionAtBeginning = (
    ref: React.RefObject<HTMLSpanElement>
): boolean => {
    const range: Range | null = selectionRange(ref);
    if (range === null) {
        return false;
    }

    if (!range.collapsed) {
        return false;
    }

    const elem = contentEditableElement(ref);
    if (range.startContainer === elem && range.startOffset === 0) {
        return true;
    }

    if (elem.firstChild !== null) {
        if (
            range.startContainer === elem.firstChild &&
            range.startOffset === 0
        ) {
            return true;
        }
    }

    return false;
};

export const splitContentBySelection = (
    ref: React.RefObject<HTMLSpanElement>
): [Range, Range] => {
    const currentRange: Range | null = selectionRange(ref);
    const elem = contentEditableElement(ref);

    const beforeRange: Range = document.createRange();
    const afterRange: Range = document.createRange();

    if (currentRange !== null) {
        beforeRange.setStart(elem, 0);
        beforeRange.setEnd(
            currentRange.startContainer,
            currentRange.startOffset
        );
        afterRange.setStart(currentRange.endContainer, currentRange.endOffset);
        afterRange.setEnd(elem, elem.childNodes.length);
    } else {
        beforeRange.selectNodeContents(elem);
        afterRange.setStart(beforeRange.endContainer, beforeRange.endOffset);
        afterRange.setEnd(beforeRange.endContainer, beforeRange.endOffset);
    }

    return [beforeRange, afterRange];
};

export const insertNodeAtSelection = (
    ref: React.RefObject<HTMLSpanElement>,
    node: Node
): boolean => {
    const elem = contentEditableElement(ref);
    const range = selectionRange(ref);
    if (range === null) {
        return false;
    }

    range.deleteContents();
    range.insertNode(node);
    range.collapse(false);
    elem.normalize();
    return true;
};

export const childIndex = (parent: Node, child: Node): number | null => {
    const childNodes = parent.childNodes;
    for (let i = 0; i < childNodes.length; i++) {
        if (child === childNodes.item(i)) {
            return i;
        }
    }

    return null;
};

export const nodeBeforeSelection = (
    ref: React.RefObject<HTMLSpanElement>
): Node | null => {
    const elem = contentEditableElement(ref);
    const range = selectionRange(ref);
    if (range === null) {
        return null;
    }

    let targetNodeIndex: number;
    if (range.startContainer === elem) {
        if (range.startOffset === 0) {
            return null;
        }

        targetNodeIndex = range.startOffset - 1;
    } else {
        // we'd like to step outside of the childnode
        // startOffset of 0 is the only condition we are looking for
        if (range.startOffset !== 0) {
            return null;
        }

        const currNodeIndex = childIndex(elem, range.startContainer);
        if (currNodeIndex === null || currNodeIndex === 0) {
            return null;
        }

        targetNodeIndex = currNodeIndex - 1;
    }

    return elem.childNodes.item(targetNodeIndex);
};

export const nodeAfterSelection = (
    ref: React.RefObject<HTMLSpanElement>
): Node | null => {
    const elem = contentEditableElement(ref);
    const range = selectionRange(ref);
    if (range === null) {
        return null;
    }

    const childCount = elem.childNodes.length;
    let targetNodeIndex: number;
    if (range.endContainer === elem) {
        if (range.endOffset === childCount) {
            return null;
        }

        targetNodeIndex = range.endOffset;
    } else {
        if (range.endContainer.nodeType === range.endContainer.TEXT_NODE) {
            const textNode = range.endContainer as Text;
            if (range.endOffset !== textNode.length) {
                return null;
            }
        }

        const currNodeIndex = childIndex(elem, range.endContainer);
        if (currNodeIndex === null || currNodeIndex === childCount) {
            return null;
        }

        targetNodeIndex = currNodeIndex + 1;
    }

    return elem.childNodes.item(targetNodeIndex);
};
