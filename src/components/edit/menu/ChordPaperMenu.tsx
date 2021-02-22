import { Theme } from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import FolderOpenIcon from "@material-ui/icons/FolderOpen";
import TransposeIcon from "@material-ui/icons/ImportExport";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import PlayIcon from "@material-ui/icons/PlayArrow";
import ForkIcon from "@material-ui/icons/Restaurant";
import SaveIcon from "@material-ui/icons/Save";
import {
    SpeedDial as UnstyledSpeedDial,
    SpeedDialAction,
} from "@material-ui/lab";
import { withStyles } from "@material-ui/styles";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import useKonamiCode from "react-use-konami";
import { ChordSong } from "../../../common/ChordModel/ChordSong";
import { PlainFn } from "../../../common/PlainFn";
import { User, UserContext } from "../../user/userContext";
import { useCloudCreateSong } from "./cloudSave";
import { useLoadMenuAction } from "./load";
import { useSaveMenuAction } from "./save";
import TransposeMenu from "./TransposeMenu";

interface ChordPaperMenuProps {
    song: ChordSong;
    onSongChanged: (song: ChordSong) => void;
    onPlay?: PlainFn;
}

const SpeedDial = withStyles((theme: Theme) => ({
    root: {
        position: "fixed",
        top: theme.spacing(3),
        right: theme.spacing(2),
    },
}))(UnstyledSpeedDial);

const ChordPaperMenu: React.FC<ChordPaperMenuProps> = (
    props: ChordPaperMenuProps
): JSX.Element => {
    const developmentEnv = process.env.NODE_ENV === "development";
    const [open, setOpen] = useState(false);
    const [transposeMenuOpen, setTransposeMenuOpen] = useState(false);
    const [offlineMode, setOfflineMode] = useState(developmentEnv);
    const { enqueueSnackbar } = useSnackbar();

    const user = React.useContext(UserContext);
    const loadAction = useLoadMenuAction(props.onSongChanged, enqueueSnackbar);
    const saveAction = useSaveMenuAction(props.song);
    const cloudSaveAction = useCloudCreateSong();

    const openMenu = () => {
        setOpen(true);
    };

    const closeMenu = () => {
        setOpen(false);
    };

    const forkSong = (song: ChordSong, user: User) => {
        const songClone = song.deepClone();
        cloudSaveAction(songClone, user);
    };

    useKonamiCode(() => {
        setOfflineMode(true);
        enqueueSnackbar("Local save and load buttons are enabled!", {
            variant: "info",
        });
    });

    if (transposeMenuOpen) {
        return (
            <TransposeMenu
                song={props.song}
                open
                onClose={() => {
                    setTransposeMenuOpen(false);
                }}
                onSongChanged={props.onSongChanged}
            ></TransposeMenu>
        );
    }

    return (
        <SpeedDial
            icon={<MoreVertIcon />}
            open={open}
            onOpen={openMenu}
            onClose={closeMenu}
            direction="down"
            ariaLabel="SpeedDial"
        >
            <SpeedDialAction
                icon={<PlayIcon />}
                tooltipTitle="Play Mode"
                onClick={props.onPlay}
            />

            {!props.song.isUnsaved() && user !== null && (
                <SpeedDialAction
                    icon={<ForkIcon />}
                    tooltipTitle="Fork"
                    onClick={() => forkSong(props.song, user)}
                />
            )}

            {props.song.isUnsaved() && user !== null && (
                <SpeedDialAction
                    icon={<CloudUploadIcon />}
                    tooltipTitle="Save to Cloud"
                    onClick={() => cloudSaveAction(props.song, user)}
                />
            )}

            <SpeedDialAction
                icon={<TransposeIcon />}
                tooltipTitle="Transpose"
                onClick={() => {
                    setTransposeMenuOpen(true);
                }}
            />

            {offlineMode && (
                <SpeedDialAction
                    icon={<SaveIcon />}
                    tooltipTitle="Save to computer"
                    onClick={saveAction}
                />
            )}

            {offlineMode && (
                <SpeedDialAction
                    icon={<FolderOpenIcon />}
                    tooltipTitle="Load from computer"
                    onClick={loadAction}
                />
            )}
        </SpeedDial>
    );
};

export default ChordPaperMenu;
