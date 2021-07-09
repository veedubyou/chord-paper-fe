import React, { useRef } from "react";
import { createDndContext, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// extremely hacky - overriding the implementation of the backend forcibly
// however React-DND is pretty much unmaintained, so there are few other choices
export const HTML5BackendWithCTRLKey = (
    ...params: Parameters<typeof HTML5Backend>
) => {
    const backend = HTML5Backend(...params);

    const welpThingsBroke = () => {
        console.error(
            "----------------------BAD THING HAPPENED----------------------"
        );
        console.error("HTML5 Drag and Drop backend changed internally");
        console.error("Drag and drop is probably broken");
        console.error(
            "----------------------BAD THING HAPPENED----------------------"
        );
    };

    const untypesafeBackend: any = backend;

    if (
        untypesafeBackend.handleTopDragEnter === undefined ||
        untypesafeBackend.handleTopDragEnter === null
    ) {
        welpThingsBroke();
    }

    untypesafeBackend.__original__handleTopDragEnter =
        untypesafeBackend.handleTopDragEnter;

    untypesafeBackend.handleTopDragEnter = (e: DragEvent) => {
        untypesafeBackend.__original__handleTopDragEnter(e);
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
        untypesafeBackend.__original__handleTopDragOver(e);
        untypesafeBackend.altKeyPressed = e.ctrlKey || e.metaKey;
    };

    return backend;
};

const RNDContext = createDndContext(HTML5BackendWithCTRLKey);

interface DragAndDropProps {
    children: React.ReactElement | null;
}

function useDNDProviderElement(props: DragAndDropProps) {
    const manager = useRef(RNDContext);

    if (!props.children) {
        throw new Error("No children provided to DND wrapper");
    }

    if (manager.current.dragDropManager === undefined) {
        throw new Error("No DND manager found");
    }

    return (
        <DndProvider manager={manager.current.dragDropManager}>
            {props.children}
        </DndProvider>
    );
}

const DragAndDrop: React.FC<DragAndDropProps> = (
    props: DragAndDropProps
): JSX.Element => {
    const DNDElement = useDNDProviderElement(props);
    return <React.Fragment>{DNDElement}</React.Fragment>;
};

export default DragAndDrop;
