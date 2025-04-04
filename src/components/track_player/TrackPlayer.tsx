import {
    FiveStemKeys,
    FourStemKeys,
    TwoStemKeys,
} from "common/ChordModel/tracks/StemTrack";
import { Track } from "common/ChordModel/tracks/Track";
import { PlainFn } from "common/PlainFn";
import OneTimeErrorNotification from "components/display/OneTimeErrorNotification";
import LoadingSpinner from "components/loading/LoadingSpinner";
import SingleTrackPlayer from "components/track_player/internal_player/single/SingleTrackPlayer";
import StemTrackPlayer, {
    StemButtonSpec,
} from "components/track_player/internal_player/stem/StemTrackPlayer";
import { PlayerControls } from "components/track_player/internal_player/usePlayerControls";
import LoadingSplitStemTrackView from "components/track_player/LoadingSplitStemTrackView";
import { useTrackFetch } from "components/track_player/providers/useTrackFetch";
import React from "react";

interface TrackPlayerProps {
    showing: boolean;
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
            return <LoadingSpinner />;
        }

        case "error": {
            return (
                <OneTimeErrorNotification
                    componentDescription="Track Player"
                    error={trackLoad.error}
                />
            );
        }

        case "loaded": {
            return (
                <LoadedTrackPlayer
                    showing={props.showing}
                    track={trackLoad.track}
                    playerControls={props.playerControls}
                    refreshTrackFn={refreshTrackFn}
                />
            );
        }
    }
};

interface LoadedTrackPlayerProps {
    showing: boolean;
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
                        showing={props.showing}
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
                        showing={props.showing}
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
                        showing={props.showing}
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
                        showing={props.showing}
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

    return innerPlayer;
};

export default React.memo(TrackPlayer);
