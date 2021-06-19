import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl as UnstyledFormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select as UnstyledSelect,
    Theme,
} from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React, { useState } from "react";
import { ChordSong } from "../../../common/ChordModel/ChordSong";
import { AllNotes, Note } from "../../../common/music/foundation/Note";
import { transposeSong } from "../../../common/music/transpose/Transpose";
import { PlainFn } from "../../../common/PlainFn";

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

interface KeySelection {
    originalKey: Note;
    transposedKey: Note;
}

const TransposeMenu: React.FC<TransposeMenuProps> = (
    props: TransposeMenuProps
): JSX.Element => {
    const [keySelection, setKeySelection] = useState<KeySelection>({
        originalKey: "C",
        transposedKey: "C",
    });

    const keySelectChangeHandler = (
        changedField: "originalKey" | "transposedKey"
    ): ((event: React.ChangeEvent<{ value: unknown }>) => void) => {
        return (event: React.ChangeEvent<{ value: unknown }>) => {
            const newSelectValue = event.target.value as Note;
            const newKeySelection = { ...keySelection };
            newKeySelection[changedField] = newSelectValue;
            setKeySelection(newKeySelection);
        };
    };

    const handleTransposeAction = (): void => {
        transposeSong(
            props.song,
            keySelection.originalKey,
            keySelection.transposedKey
        );
        props.onSongChanged(props.song);
        props.onClose();
    };

    const createKeySelect = (
        id: string,
        currentKey: Note,
        changeHandler: (event: React.ChangeEvent<{ value: unknown }>) => void
    ) => {
        const menuItems: React.ReactElement[] = [];

        for (const keyName in AllNotes) {
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
                <Grid container direction="row">
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
                    </Grid>
                    <Grid item>
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
