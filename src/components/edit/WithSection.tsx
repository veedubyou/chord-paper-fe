import { Box, Theme, Tooltip as UnstyledTooltip } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { ChordLine } from "../../common/ChordModel/ChordLine";
import { IDable } from "../../common/ChordModel/Collection";
import { DataTestID } from "../../common/DataTestID";
import { PlainFn } from "../../common/PlainFn";
import {
    sectionLabelStyle,
    sectionTypographyVariant,
} from "../display/SectionLabel";
import UnstyledEditableTypography, { EditControl } from "./EditableTypography";
import { useEditingState } from "./InteractionContext";
import TimeInput from "./TimeInput";

const EditableTypography = withStyles(sectionLabelStyle)(
    UnstyledEditableTypography
);

const Tooltip = withStyles((theme: Theme) => ({
    tooltip: {
        background: "white",
        boxShadow: theme.shadows[2],
    },
}))(UnstyledTooltip);

export interface MenuItem extends DataTestID {
    icon: React.ReactElement;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export interface WithSectionProps {
    chordLine: ChordLine;
    children: (editLabel: PlainFn) => React.ReactElement;
    onChange?: (id: IDable<ChordLine>) => void;
}

const WithSection: React.FC<WithSectionProps> = (
    props: WithSectionProps
): JSX.Element => {
    const { editing, startEdit, finishEdit } = useEditingState();

    const editControl: EditControl = {
        editing: editing,
        onStartEdit: startEdit,
        onEndEdit: finishEdit,
    };

    const handleLabelChange = (newValue: string) => {
        const changed = props.chordLine.setSectionName(newValue);

        if (changed) {
            props.onChange?.(props.chordLine);
        }
    };

    const handleTimeChange = (newValue: number | null) => {
        const changed = props.chordLine.setSectionTime(newValue);

        if (changed) {
            props.onChange?.(props.chordLine);
        }
    };

    const childElement: React.ReactElement = props.children(startEdit);
    const section = props.chordLine.section;

    if (!editing && section === undefined) {
        return childElement;
    }

    const label: string = section?.name ?? "";

    const timeInput = (() => {
        const time: number | null =
            section?.type === "time" ? section.time : null;

        return <TimeInput seconds={time} onFinish={handleTimeChange} />;
    })();

    return (
        <>
            <Box>
                <Tooltip
                    arrow
                    placement="left"
                    interactive
                    title={timeInput}
                    disableFocusListener
                >
                    <span>
                        <EditableTypography
                            value={label}
                            variant={sectionTypographyVariant}
                            data-testid="EditLabel"
                            editControl={editControl}
                            onValueChange={handleLabelChange}
                        />
                    </span>
                </Tooltip>
            </Box>
            {childElement}
        </>
    );
};

export default WithSection;
