import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl as UnstyledFormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select as UnstyledSelect,
    Theme,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React, { useState } from "react";
import { ChordSong } from "../../../common/ChordModel/ChordSong";
import { PlainFn } from "../../../common/PlainFn";
import {
    isMajorKey,
    isMinorKey,
    MajorKeys,
    MinorKeys,
} from "../../../common/transpose/Keys";
import { ChromaticScale } from "../../../common/transpose/MusicNotes";
import { transposeSong } from "../../../common/transpose/Transpose";

interface TransposeMenuProps {
    open: boolean;
    song: ChordSong;
    onClose: PlainFn;
    onSongChanged: (song: ChordSong) => void;
}

const FormControl = withStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(2),
        display: "flex",
    },
}))(UnstyledFormControl);

const Select = withStyles((theme: Theme) => ({
    root: {
        margin: theme.spacing(0.5),
    },
}))(UnstyledSelect);

interface MajorKeySelection {
    type: "major";
    originalKey: keyof typeof MajorKeys;
    transposedKey: keyof typeof MajorKeys;
}

interface MinorKeySelection {
    type: "minor";
    originalKey: keyof typeof MinorKeys;
    transposedKey: keyof typeof MinorKeys;
}

type KeySelection = MajorKeySelection | MinorKeySelection;

const TransposeMenu: React.FC<TransposeMenuProps> = (
    props: TransposeMenuProps
): JSX.Element => {
    const [keySelection, setKeySelection] = useState<KeySelection>({
        type: "major",
        originalKey: ChromaticScale.C,
        transposedKey: ChromaticScale.C,
    });

    const handleModalityChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        switch (event.target.value) {
            case "major": {
                const newKeySelection: MajorKeySelection = {
                    type: "major",
                    originalKey: isMajorKey(keySelection.originalKey)
                        ? keySelection.originalKey
                        : ChromaticScale.C,
                    transposedKey: isMajorKey(keySelection.transposedKey)
                        ? keySelection.transposedKey
                        : ChromaticScale.C,
                };

                setKeySelection(newKeySelection);
                break;
            }
            case "minor": {
                const newKeySelection: MinorKeySelection = {
                    type: "minor",
                    originalKey: isMinorKey(keySelection.originalKey)
                        ? keySelection.originalKey
                        : ChromaticScale.C,
                    transposedKey: isMinorKey(keySelection.transposedKey)
                        ? keySelection.transposedKey
                        : ChromaticScale.C,
                };

                setKeySelection(newKeySelection);
                break;
            }
            default: {
                throw new Error("Only major or minor is expected");
            }
        }
    };

    const keySelectChangeHandler = (
        changedField: "originalKey" | "transposedKey"
    ): ((event: React.ChangeEvent<{ value: unknown }>) => void) => {
        return (event: React.ChangeEvent<{ value: unknown }>) => {
            const newSelectValue = event.target.value as ChromaticScale;
            const newKeySelection = { ...keySelection };

            switch (newKeySelection.type) {
                case "major":
                    if (!isMajorKey(newSelectValue)) {
                        throw new Error(
                            "Unexpected: Selection is not a major key"
                        );
                    }
                    newKeySelection[changedField] = newSelectValue;
                    break;
                case "minor":
                    if (!isMinorKey(newSelectValue)) {
                        throw new Error(
                            "Unexpected: Selection is not a minor key"
                        );
                    }
                    newKeySelection[changedField] = newSelectValue;
                    break;
            }

            setKeySelection(newKeySelection);
        };
    };

    const handleTransposeAction = (): void => {
        const fromKey =
            keySelection.type === "major"
                ? MajorKeys[keySelection.originalKey]
                : MinorKeys[keySelection.originalKey];
        const toKey =
            keySelection.type === "major"
                ? MajorKeys[keySelection.transposedKey]
                : MinorKeys[keySelection.transposedKey];

        transposeSong(props.song, fromKey, toKey);
        props.onSongChanged(props.song);
        props.onClose();
    };

    const createKeySelect = (
        id: string,
        currentKey: ChromaticScale,
        changeHandler: (event: React.ChangeEvent<{ value: unknown }>) => void
    ) => {
        const keyCollection =
            keySelection.type === "major" ? MajorKeys : MinorKeys;
        const menuItems: React.ReactElement[] = [];

        for (const keyName in keyCollection) {
            menuItems.push(<MenuItem value={keyName}>{keyName}</MenuItem>);
        }

        return (
            <Select id={id} value={currentKey} onChange={changeHandler}>
                {menuItems}
            </Select>
        );
    };

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Transpose Key</DialogTitle>
            <DialogContent>
                <Grid container>
                    <Grid item>
                        <FormControl>
                            <RadioGroup
                                value={keySelection.type}
                                onChange={handleModalityChange}
                            >
                                <FormControlLabel
                                    value="major"
                                    control={<Radio />}
                                    label="Major"
                                />
                                <FormControlLabel
                                    value="minor"
                                    control={<Radio />}
                                    label="Minor"
                                />
                            </RadioGroup>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <FormControl>
                            <InputLabel htmlFor="original-key">
                                Original Key
                            </InputLabel>
                            {createKeySelect(
                                "original-key",
                                keySelection.originalKey,
                                keySelectChangeHandler("originalKey")
                            )}
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="transposed-key">
                                Transposed Key
                            </InputLabel>
                            {createKeySelect(
                                "transposed-key",
                                keySelection.transposedKey,
                                keySelectChangeHandler("transposedKey")
                            )}
                        </FormControl>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button onClick={handleTransposeAction}>Transpose</Button>
            </DialogActions>
        </Dialog>
    );
};

export default TransposeMenu;
