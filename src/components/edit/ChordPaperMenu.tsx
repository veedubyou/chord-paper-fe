import { Theme } from "@material-ui/core";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import SaveIcon from "@material-ui/icons/Save";
import {
    SpeedDial as UnstyledSpeedDial,
    SpeedDialAction,
    SpeedDialIcon,
} from "@material-ui/lab";
import { withStyles } from "@material-ui/styles";
import { isLeft } from "fp-ts/lib/Either";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { ChordSong } from "../../common/ChordModel/ChordSong";

interface ChordPaperMenuProps {
    song: ChordSong;
    onLoad?: (loadedSong: ChordSong) => void;
    onNewSong?: () => void;
}

const SpeedDial = withStyles((theme: Theme) => ({
    root: {
        position: "fixed",
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
}))(UnstyledSpeedDial);

const ChordPaperMenu: React.FC<ChordPaperMenuProps> = (
    props: ChordPaperMenuProps
): JSX.Element => {
    const [open, setOpen] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    const openMenu = () => {
        setOpen(true);
    };

    const closeMenu = () => {
        setOpen(false);
    };

    const saveAction = () => {
        const jsonStr = JSON.stringify(props.song);

        const blob = new Blob([jsonStr], {
            type: "application/json",
        });
        const objectURL = URL.createObjectURL(blob);

        const anchor = document.createElement("a");

        anchor.download = "chord_paper_song.json";
        if (props.song.title !== "") {
            anchor.download = props.song.title + ".json";
        }
        anchor.href = objectURL;
        anchor.click();

        URL.revokeObjectURL(objectURL);
    };

    function pickFileHandler(this: HTMLInputElement) {
        const fileList = this.files;
        if (fileList === null) {
            return;
        }

        if (fileList.length > 1) {
            enqueueSnackbar("Multiple files selected, only one file expected", {
                variant: "error",
            });
            return;
        }

        const file = fileList.item(0);
        if (file === null) {
            enqueueSnackbar("Could not retrieve file from file dialog", {
                variant: "error",
            });
            return;
        }

        const fileReader = new FileReader();
        fileReader.onload = (ev: ProgressEvent<FileReader>) => {
            if (
                ev.target === null ||
                ev.target.result === null ||
                ev.target.result instanceof ArrayBuffer
            ) {
                return;
            }

            const results = ChordSong.deserialize(ev.target.result);
            if (isLeft(results)) {
                enqueueSnackbar(
                    "Can't load file, Song file failed validation",
                    {
                        variant: "error",
                    }
                );
                return;
            }

            if (props.onLoad) {
                props.onLoad(results.right);
            }
        };

        fileReader.readAsText(file);
    }

    const loadAction = async () => {
        const inputElem: HTMLInputElement = document.createElement("input");
        inputElem.type = "file";
        inputElem.addEventListener("change", pickFileHandler);

        inputElem.click();
    };

    return (
        <SpeedDial
            icon={<SpeedDialIcon />}
            open={open}
            onOpen={openMenu}
            onClose={closeMenu}
            ariaLabel="SpeedDial"
        >
            <SpeedDialAction
                icon={<SaveIcon />}
                tooltipTitle="Save"
                onClick={saveAction}
            />
            <SpeedDialAction
                icon={<FolderOpenIcon />}
                tooltipTitle="Load"
                onClick={loadAction}
            />
            <SpeedDialAction
                icon={<NoteAddIcon />}
                tooltipTitle="New Song"
                onClick={props.onNewSong}
            />
        </SpeedDial>
    );
};

export default ChordPaperMenu;
