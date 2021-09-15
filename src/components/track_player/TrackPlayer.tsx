import { Collapse } from "@material-ui/core";
import React from "react";
import {
    FiveStemKeys,
    FourStemKeys,
    TwoStemKeys,
} from "../../common/ChordModel/tracks/StemTrack";
import { Track } from "../../common/ChordModel/tracks/Track";
import SingleTrackPlayer from "./internal_player/single/SingleTrackPlayer";
import StemTrackPlayer, {
    StemButtonSpec,
} from "./internal_player/stem/StemTrackPlayer";
import { PlayerControls } from "./internal_player/usePlayerControls";
import LoadingTrackView from "./LoadingTrackView";

interface TrackPlayerProps {
    focused: boolean;
    currentTrack: boolean;
    track: Track;
    playerControls: PlayerControls;
}

const TrackPlayer: React.FC<TrackPlayerProps> = (
    props: TrackPlayerProps
): JSX.Element => {
    const innerPlayer: React.ReactElement = (() => {
        switch (props.track.track_type) {
            case "single": {
                return (
                    <SingleTrackPlayer
                        focused={props.focused}
                        currentTrack={props.currentTrack}
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
                        currentTrack={props.currentTrack}
                        track={props.track}
                        buttonSpecs={buttonSpecs}
                        playerControls={props.playerControls}
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
                        currentTrack={props.currentTrack}
                        track={props.track}
                        buttonSpecs={buttonSpecs}
                        playerControls={props.playerControls}
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
                        currentTrack={props.currentTrack}
                        track={props.track}
                        buttonSpecs={buttonSpecs}
                        playerControls={props.playerControls}
                    />
                );
            }

            case "split_2stems":
            case "split_4stems":
            case "split_5stems": {
                return <LoadingTrackView track={props.track} />;
            }
        }
    })();

    return <Collapse in={props.focused}>{innerPlayer}</Collapse>;
};

export default TrackPlayer;
