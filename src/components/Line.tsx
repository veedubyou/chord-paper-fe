import {
    Box,
    ButtonGroup,
    Tooltip as UnstyledTooltop,
    Typography,
    withStyles,
    Button as UnstyledButton,
    Theme,
    Slide,
} from "@material-ui/core";
import React, { useState } from "react";
import EditingLine from "./EditingLine";

import UnstyledEditIcon from "@material-ui/icons/Edit";
import UnstyledAddIcon from "@material-ui/icons/Add";
import UnstyledRemoveIcon from "@material-ui/icons/Remove";

import grey from "@material-ui/core/colors/grey";

import { DataTestID } from "./common/DataTestID";
import { tokenize } from "../utils/lyric_tokenizer";

interface LineProps extends DataTestID {
    id: string;
    text: string;
    onChange?: (id: string, newValue: string) => void;
    onAdd?: (id: string) => void;
    onRemove?: (id: string) => void;
}

const iconColorStyle = {
    root: {
        color: "white",
    },
};

const EditIcon = withStyles(iconColorStyle)(UnstyledEditIcon);
const AddIcon = withStyles(iconColorStyle)(UnstyledAddIcon);
const RemoveIcon = withStyles(iconColorStyle)(UnstyledRemoveIcon);

const Button = withStyles((theme: Theme) => ({
    contained: {
        backgroundColor: theme.palette.primary.main,
        "&:hover": {
            backgroundColor: theme.palette.primary.dark,
        },
    },
}))(UnstyledButton);

const Tooltip = withStyles({
    tooltip: {
        padding: 0,
    },
})(UnstyledTooltop);

const HighlightableText = withStyles((theme: Theme) => ({
    root: {
        "&:hover": {
            color: theme.palette.secondary.main,
        },
    },
}))(Typography);

const HighlightableBox = withStyles({
    root: {
        "&:hover": {
            backgroundColor: grey[100],
        },
    },
})(Box);

const Line: React.FC<LineProps> = (props: LineProps): JSX.Element => {
    const [editing, setEditing] = useState(false);
    const [removed, setRemoved] = useState(false);

    const startEdit = () => {
        setEditing(true);
    };

    const finishEdit = () => {
        setEditing(false);
    };

    const addHandler = () => {
        if (props.onAdd) {
            props.onAdd(props.id);
        }
    };

    const removalTime = 250;

    const removeHandler = () => {
        setRemoved(true);

        setTimeout(() => {
            if (props.onRemove) {
                props.onRemove(props.id);
            }
        }, removalTime);
    };

    const testID = (suffix: string): string | undefined => {
        if (!props["data-testid"]) {
            return undefined;
        }

        return `${props["data-testid"]}-${suffix}`;
    };

    const changeHandler = (): ((newValue: string) => void) => {
        return (newValue: string) => {
            if (props.onChange) {
                props.onChange(props.id, newValue);
            }
        };
    };

    const hoverMenu = (): React.ReactElement => {
        return (
            <ButtonGroup variant="outlined">
                <Button
                    variant="contained"
                    onClick={startEdit}
                    data-testid={testID("EditButton")}
                >
                    <EditIcon />
                </Button>
                <Button
                    variant="contained"
                    onClick={addHandler}
                    data-testid={testID("AddButton")}
                >
                    <AddIcon />
                </Button>
                <Button
                    variant="contained"
                    onClick={removeHandler}
                    data-testid={testID("RemoveButton")}
                >
                    <RemoveIcon />
                </Button>
            </ButtonGroup>
        );
    };

    const nonEditableLine = (): React.ReactElement => {
        let text = props.text;
        if (text.trim() === "") {
            text = "\u00A0"; //white space to prevent the line being deflated
        }

        let tokens = tokenize(text);

        return (
            <Tooltip title={hoverMenu()} interactive>
                <HighlightableBox data-testid={testID("NoneditableLine")}>
                    {tokens.map((token: string, index: number) => (
                        <HighlightableText
                            key={`${token}-${index}`}
                            variant="h5"
                            noWrap
                            display="inline"
                            data-testid={testID(`Word-${index}`)}
                        >
                            {token}
                        </HighlightableText>
                    ))}
                </HighlightableBox>
            </Tooltip>
        );
    };

    let elem: React.ReactElement;
    if (!editing) {
        elem = nonEditableLine();
    } else {
        elem = (
            <EditingLine
                text={props.text}
                onChange={changeHandler()}
                onFinish={finishEdit}
                data-testid={testID("EditableLine")}
            />
        );
    }

    const yeetDirection = removed ? "up" : "down";

    return (
        <Slide direction={yeetDirection} in={!removed} timeout={removalTime}>
            <Box
                borderBottom={1}
                borderColor="grey.50"
                width="auto"
                margin={"3rem"}
            >
                {elem}
            </Box>
        </Slide>
    );
};

export default Line;
