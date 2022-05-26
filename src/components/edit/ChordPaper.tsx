import { Paper, styled } from "@mui/material";
import React from "react";
import { Helmet } from "react-helmet-async";
import { ChordSong } from "../../common/ChordModel/ChordSong";
import { PlainFn } from "../../common/PlainFn";
import CenteredLayoutWithMenu from "../display/CenteredLayoutWithMenu";
import LoadingRender from "../loading/LoadingRender";
import PlayerTimeProvider from "../PlayerTimeContext";
import { ChordSongAction } from "../reducer/reducer";
import JamStation from "../track_player/JamStation";
import TrackListProvider, {
    TrackListChangeHandler,
    TrackListLoad,
} from "../track_player/providers/TrackListProvider";
import ChordPaperBody from "./ChordPaperBody";
import Header from "./Header";
import ChordPaperMenu from "./menu/ChordPaperMenu";

const RootPaper = styled(Paper)(({ theme }) => ({
    position: "relative",
    margin: theme.spacing(5),
    minHeight: theme.spacing(92),
    minWidth: theme.spacing(92),
}));

interface ChordPaperProps {
    song: ChordSong;
    songDispatch: React.Dispatch<ChordSongAction>;
    onPlay?: PlainFn;
}

const ChordPaper: React.FC<ChordPaperProps> = (
    props: ChordPaperProps
): JSX.Element => {
    const trackPlayer: React.ReactNode = (() => {
        if (props.song.isUnsaved()) {
            return null;
        }

        return (
            <TrackListProvider song={props.song}>
                {(
                    tracklistLoad: TrackListLoad,
                    onRefresh: PlainFn,
                    changeHandler: TrackListChangeHandler
                ) => (
                    <JamStation
                        collapsedButtonSx={{
                            backgroundColor: "white",
                        }}
                        timeSections={props.song.timeSections}
                        tracklistLoad={tracklistLoad}
                        onTrackListChanged={changeHandler}
                        onRefresh={onRefresh}
                    />
                )}
            </TrackListProvider>
        );
    })();

    return (
        <PlayerTimeProvider>
            <Helmet>
                <title>
                    {props.song.metadata.title !== ""
                        ? props.song.metadata.title
                        : "New Song"}
                </title>
            </Helmet>
            <RootPaper elevation={3} data-testid="ChordPaper">
                <Header
                    data-testid={"Header"}
                    song={props.song}
                    songDispatch={props.songDispatch}
                />
                <ChordPaperBody
                    song={props.song}
                    songDispatch={props.songDispatch}
                />
                <ChordPaperMenu
                    song={props.song}
                    songDispatch={props.songDispatch}
                    onPlay={props.onPlay}
                />
                {trackPlayer}
            </RootPaper>
        </PlayerTimeProvider>
    );
};

const ChordPaperScreen: React.FC<ChordPaperProps> = (
    props: ChordPaperProps
): JSX.Element => {
    return (
        <LoadingRender>
            <CenteredLayoutWithMenu>
                <ChordPaper {...props} />
            </CenteredLayoutWithMenu>
        </LoadingRender>
    );
};

export default ChordPaperScreen;
