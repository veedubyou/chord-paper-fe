import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

type DragEventHandler = (e: DragEvent) => void;

type UnsafeBackend = {
    handleTopDragEnter: DragEventHandler | null | undefined;
    handleTopDragOver: DragEventHandler | null | undefined;
    __original__handleTopDragEnter: DragEventHandler | null | undefined;
    __original__handleTopDragOver: DragEventHandler | null | undefined;
    altKeyPressed: boolean;
};

// extremely hacky - overriding the implementation of the backend forcibly
// however React-DND is pretty much unmaintained, so there are few other choices
export const HTML5BackendWithCTRLKey = (
    ...params: Parameters<typeof HTML5Backend>
) => {
    const backend = HTML5Backend(...params);

    const welpThingsBroke = (): never => {
        console.error(
            "----------------------BAD THING HAPPENED----------------------"
        );
        console.error("HTML5 Drag and Drop backend changed internally");
        console.error("Drag and drop is probably broken");
        console.error(
            "----------------------BAD THING HAPPENED----------------------"
        );

        throw new Error("HTMLBackend changed and is now broken");
    };

    const untypesafeBackend: UnsafeBackend =
        backend as unknown as UnsafeBackend;

    if (
        untypesafeBackend.handleTopDragEnter === undefined ||
        untypesafeBackend.handleTopDragEnter === null
    ) {
        welpThingsBroke();
    }

    untypesafeBackend.__original__handleTopDragEnter =
        untypesafeBackend.handleTopDragEnter;

    untypesafeBackend.handleTopDragEnter = (e: DragEvent) => {
        untypesafeBackend.__original__handleTopDragEnter?.(e);
        untypesafeBackend.altKeyPressed = e.ctrlKey || e.metaKey;
    };

    if (
        untypesafeBackend.handleTopDragOver === undefined ||
        untypesafeBackend.handleTopDragOver === null
    ) {
        welpThingsBroke();
    }

    untypesafeBackend.__original__handleTopDragOver =
        untypesafeBackend.handleTopDragOver;
    untypesafeBackend.handleTopDragOver = (e: DragEvent) => {
        untypesafeBackend.__original__handleTopDragOver?.(e);
        untypesafeBackend.altKeyPressed = e.ctrlKey || e.metaKey;
    };

    return backend;
};

interface DragAndDropProps {
    children: React.ReactElement;
}

const DragAndDrop: React.FC<DragAndDropProps> = (
    props: DragAndDropProps
): JSX.Element => {
    return (
        <DndProvider backend={HTML5BackendWithCTRLKey}>
            {props.children}
        </DndProvider>
    );
};

export default DragAndDrop;
