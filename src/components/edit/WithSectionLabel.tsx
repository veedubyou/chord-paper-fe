import { Box } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { IDable } from "../../common/ChordModel/Collection";
import { PlainFn } from "../../common/PlainFn";
import { DataTestID } from "../../common/DataTestID";
import {
    sectionLabelStyle,
    sectionTypographyVariant,
} from "../display/SectionLabel";
import UnstyledEditableTypography, { EditControl } from "./EditableTypography";
import { useEditingState } from "./InteractionContext";

const EditableTypography = withStyles(sectionLabelStyle)(
    UnstyledEditableTypography
);

export interface MenuItem extends DataTestID {
    icon: React.ReactElement;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export interface WithSectionLabelProps {
    chordLine: ChordLine;
    children: (editLabel: PlainFn) => React.ReactElement;
    onChangeLabel?: (id: IDable<ChordLine>) => void;
}

const WithSectionLabel: React.FC<WithSectionLabelProps> = (
    props: WithSectionLabelProps
): JSX.Element => {
    const { editing, startEdit, finishEdit } = useEditingState();

    const editControl: EditControl = {
        editing: editing,
        onStartEdit: startEdit,
        onEndEdit: finishEdit,
    };

    const handleLabelChange = (newValue: string) => {
        const newLabel: string | undefined =
            newValue !== "" ? newValue : undefined;

        props.chordLine.label = newLabel;
        props.onChangeLabel?.(props.chordLine);
    };

    const childElement: React.ReactElement = props.children(startEdit);

    if (!editing && props.chordLine.label === undefined) {
        return childElement;
    }

    const label: string = props.chordLine.label ?? "";

    return (
        <>
            <Box>
                <EditableTypography
                    variant={sectionTypographyVariant}
                    data-testid="EditLabel"
                    editControl={editControl}
                    onValueChange={handleLabelChange}
                >
                    {label}
                </EditableTypography>
            </Box>
            {childElement}
        </>
    );
};

export default WithSectionLabel;
