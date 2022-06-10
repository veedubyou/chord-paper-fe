import { Box, styled, Theme } from "@mui/material";
import { ChordLine } from "common/ChordModel/ChordLine";
import { DataTestID } from "common/DataTestID";
import { PlainFn } from "common/PlainFn";
import {
    sectionLabelStyle,
    sectionTypographyVariant,
} from "components/display/SectionLabel";
import UnstyledEditableTypography, {
    EditControl,
} from "components/edit/EditableTypography";
import { useEditingState } from "components/edit/InteractionContext";
import { makeStyledTooltipMenu } from "components/edit/StyledTooltip";
import TimeInput from "components/edit/TimeInput";
import { ChordSongAction } from "components/reducer/reducer";
import React, { useCallback } from "react";

const EditableTypography = styled(UnstyledEditableTypography)({
    ...sectionLabelStyle,
});

const Tooltip = makeStyledTooltipMenu((theme: Theme) => ({
    background: "white",
    boxShadow: theme.shadows[2],
}));

export interface MenuItem extends DataTestID {
    icon: React.ReactElement;
    onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export interface WithSectionProps {
    chordLine: ChordLine;
    songDispatch: React.Dispatch<ChordSongAction>;
    children: (editLabel: PlainFn) => React.ReactElement;
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

    const { chordLine, songDispatch } = props;

    const handleLabelChange = useCallback(
        (newValue: string) => {
            songDispatch({
                type: "set-section",
                lineID: chordLine,
                label: newValue,
            });
        },
        [chordLine, songDispatch]
    );

    const handleTimeChange = useCallback(
        (newValue: number | null) => {
            songDispatch({
                type: "set-section",
                lineID: chordLine,
                time: newValue,
            });
        },
        [chordLine, songDispatch]
    );

    const childElement: React.ReactElement = props.children(startEdit);
    const section = props.chordLine.section;

    if (!editing && section === undefined) {
        return childElement;
    }

    const label: string = section?.name ?? "";

    const timeInput = (() => {
        const time: number | null =
            section?.type === "time" ? section.time : null;

        return (
            <TimeInput
                seconds={time}
                onFinish={handleTimeChange}
                label="timestamp"
            />
        );
    })();

    // prevent tooltip from stealing focus from the editable textfield
    const disableTooltipFocus = editing;

    return (
        <>
            <Box>
                <Tooltip
                    arrow
                    placement="left"
                    title={timeInput}
                    disableFocusListener={disableTooltipFocus}
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
