import { Collapse } from "@material-ui/core";
import React from "react";
import {
    FiveStemKeys,
    FourStemKeys,
    TwoStemKeys,
} from "../../common/ChordModel/tracks/StemTrack";
import { Track } from "../../common/ChordModel/tracks/Track";
import { PlainFn } from "../../common/PlainFn";
import ErrorImage from "../display/ErrorImage";
import SingleTrackPlayer from "./internal_player/single/SingleTrackPlayer";
import StemTrackPlayer, {
    StemButtonSpec,
} from "./internal_player/stem/StemTrackPlayer";
import { PlayerControls } from "./internal_player/usePlayerControls";
import LoadingSplitStemTrackView from "./LoadingSplitStemTrackView";
import { useTrackFetch } from "./providers/useTrackFetch";
import WaitingSpinner from "./WaitingSpinner";

interface TrackPlayerProps {
    focused: boolean;
    isCurrentTrack: boolean;
    tracklistID: string;
    trackID: string;
    playerControls: PlayerControls;
}

const TrackPlayer: React.FC<TrackPlayerProps> = (
    props: TrackPlayerProps
): JSX.Element => {
    const [trackLoad, refreshTrackFn] = useTrackFetch(
        props.tracklistID,
        props.trackID
    );

    switch (trackLoad.state) {
        case "loading": {
            return <WaitingSpinner />;
        }

        case "error": {
            return <ErrorImage error={trackLoad.error} />;
        }

        case "loaded": {
            return (
                <LoadedTrackPlayer
                    track={trackLoad.track}
                    focused={props.focused}
                    isCurrentTrack={props.isCurrentTrack}
                    playerControls={props.playerControls}
                    refreshTrackFn={refreshTrackFn}
                />
            );
        }
    }
};

interface LoadedTrackPlayerProps {
    focused: boolean;
    isCurrentTrack: boolean;
    track: Track;
    playerControls: PlayerControls;
    refreshTrackFn: PlainFn;
}

const LoadedTrackPlayer: React.FC<LoadedTrackPlayerProps> = (
    props: LoadedTrackPlayerProps
): JSX.Element => {
    const innerPlayer: React.ReactElement = (() => {
        switch (props.track.track_type) {
            case "single": {
                return (
                    <SingleTrackPlayer
                        focused={props.focused}
                        isCurrentTrack={props.isCurrentTrack}
                        track={props.track}
                        playerControls={props.playerControls}
                    />
                );
            }

            case "2stems": {
                const buttonSpecs: StemButtonSpec<TwoStemKeys>[] = [
                    {
                        label: "vocals",
                        buttonColour: "lightBlue",
                    },
                    {
                        label: "accompaniment",
                        buttonColour: "purple",
                    },
                ];

                return (
                    <StemTrackPlayer
                        focused={props.focused}
                        isCurrentTrack={props.isCurrentTrack}
                        track={props.track}
                        buttonSpecs={buttonSpecs}
                        playerControls={props.playerControls}
                        refreshTrackFn={props.refreshTrackFn}
                    />
                );
            }

            case "4stems": {
                const buttonSpecs: StemButtonSpec<FourStemKeys>[] = [
                    {
                        label: "vocals",
                        buttonColour: "lightBlue",
                    },
                    {
                        label: "other",
                        buttonColour: "purple",
                    },
                    {
                        label: "bass",
                        buttonColour: "pink",
                    },
                    {
                        label: "drums",
                        buttonColour: "yellow",
                    },
                ];

                return (
                    <StemTrackPlayer
                        focused={props.focused}
                        isCurrentTrack={props.isCurrentTrack}
                        track={props.track}
                        buttonSpecs={buttonSpecs}
                        playerControls={props.playerControls}
                        refreshTrackFn={props.refreshTrackFn}
                    />
                );
            }

            case "5stems": {
                const buttonSpecs: StemButtonSpec<FiveStemKeys>[] = [
                    {
                        label: "vocals",
                        buttonColour: "lightBlue",
                    },
                    {
                        label: "other",
                        buttonColour: "purple",
                    },
                    {
                        label: "piano",
                        buttonColour: "lightGreen",
                    },
                    {
                        label: "bass",
                        buttonColour: "pink",
                    },
                    {
                        label: "drums",
                        buttonColour: "yellow",
                    },
                ];

                return (
                    <StemTrackPlayer
                        focused={props.focused}
                        isCurrentTrack={props.isCurrentTrack}
                        track={props.track}
                        buttonSpecs={buttonSpecs}
                        playerControls={props.playerControls}
                        refreshTrackFn={props.refreshTrackFn}
                    />
                );
            }

            case "split_2stems":
            case "split_4stems":
            case "split_5stems": {
                return (
                    <LoadingSplitStemTrackView
                        track={props.track}
                        refreshTrackFn={props.refreshTrackFn}
                    />
                );
            }
        }
    })();

    return <Collapse in={props.focused}>{innerPlayer}</Collapse>;
};

export default TrackPlayer;
