import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl as UnstyledFormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    MenuItem,
    Select as UnstyledSelect,
    SelectChangeEvent,
    styled,
    Switch,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { ChordSong } from "common/ChordModel/ChordSong";
import { AllNotes, Note } from "common/music/foundation/Note";
import { PlainFn } from "common/PlainFn";
import { ChordSongAction } from "components/reducer/reducer";
import { UserContext } from "components/user/userContext";
import React, { useContext, useState } from "react";

interface TransposeMenuProps {
    open: boolean;
    song: ChordSong;
    songDispatch: React.Dispatch<ChordSongAction>;
    onClose: PlainFn;
}

const FormControl = styled(UnstyledFormControl)(({ theme }) => ({
    margin: theme.spacing(2),
    display: "flex",
}));

const Select = styled(UnstyledSelect)(({ theme }) => ({
    margin: theme.spacing(0.5),
}));

interface KeySelection {
    originalKey: Note;
    transposedKey: Note;
}

const TransposeMenu: React.FC<TransposeMenuProps> = (
    props: TransposeMenuProps
): JSX.Element => {
    const user = useContext(UserContext);
    const [keySelection, setKeySelection] = useState<KeySelection>({
        originalKey: "C",
        transposedKey: "C",
    });

    const [modifyMode, setModifyMode] = useState<"in-place" | "new-song">(
        "in-place"
    );

    const keySelectChangeHandler = (
        changedField: "originalKey" | "transposedKey"
    ): ((event: SelectChangeEvent<unknown>) => void) => {
        return (event: SelectChangeEvent<unknown>) => {
            const newSelectValue = event.target.value as Note;
            const newKeySelection = { ...keySelection };
            newKeySelection[changedField] = newSelectValue;
            setKeySelection(newKeySelection);
        };
    };

    const handleTransposeAction = (): void => {
        props.songDispatch({
            type: "transpose",
            originalKey: keySelection.originalKey,
            transposeKey: keySelection.transposedKey,
            modifyMode: modifyMode,
        });

        props.onClose();
    };

    const createKeySelect = (
        currentKey: Note,
        changeHandler: (event: SelectChangeEvent<unknown>) => void
    ) => {
        const menuItems: React.ReactElement[] = [];

        for (const keyName in AllNotes) {
            menuItems.push(<MenuItem value={keyName}>{keyName}</MenuItem>);
        }

        return (
            <Select value={currentKey} onChange={changeHandler}>
                {menuItems}
            </Select>
        );
    };

    const modifyModeSwitch = (
        <Switch
            checked={modifyMode === "new-song"}
            onChange={(_event: unknown, checked: boolean) => {
                if (checked) {
                    setModifyMode("new-song");
                } else {
                    setModifyMode("in-place");
                }
            }}
        />
    );

    const modifyModeControl =
        user !== null ? (
            <FormControl>
                <FormControlLabel
                    control={modifyModeSwitch}
                    labelPlacement="end"
                    label="Copy transposition into a new song"
                />
            </FormControl>
        ) : null;

    return (
        <Dialog open={props.open} onClose={props.onClose}>
            <DialogTitle>Transpose Key</DialogTitle>
            <DialogContent>
                <Box>
                    <Typography>
                        Select the keys to transpose from and to. Major and
                        minor do not need to be specified (e.g. choose G for G
                        major or G minor).
                    </Typography>
                </Box>
                <Grid container direction="row">
                    <Grid item>
                        <FormControl>
                            {createKeySelect(
                                keySelection.originalKey,
                                keySelectChangeHandler("originalKey")
                            )}
                            <FormHelperText>Original Key</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item>
                        <FormControl>
                            {createKeySelect(
                                keySelection.transposedKey,
                                keySelectChangeHandler("transposedKey")
                            )}
                            <FormHelperText>Transposed Key</FormHelperText>
                        </FormControl>
                    </Grid>
                </Grid>
                {modifyModeControl}
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button onClick={handleTransposeAction}>Transpose</Button>
            </DialogActions>
        </Dialog>
    );
};

export default TransposeMenu;
