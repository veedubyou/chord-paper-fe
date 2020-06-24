import { DndProvider, createDndContext } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import React, { useRef } from "react";

const RNDContext = createDndContext(HTML5Backend);

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
