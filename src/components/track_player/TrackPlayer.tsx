import { Collapse } from "@material-ui/core";
import React from "react";
import { TimeSection } from "../../common/ChordModel/ChordLine";
import { Track } from "../../common/ChordModel/Track";
import FourStemTrackPlayer from "./internal_player/4stems/FourStemTrackPlayer";
import SingleTrackPlayer from "./internal_player/single/SingleTrackPlayer";

interface TrackPlayerProps {
    show: boolean;
    currentTrack: boolean;

    track: Track;
    readonly timeSections: TimeSection[];
}

const TrackPlayer: React.FC<TrackPlayerProps> = (
    props: TrackPlayerProps
): JSX.Element => {
    const innerPlayer: React.ReactElement = (() => {
        switch (props.track.track_type) {
            case "single": {
                return (
                    <SingleTrackPlayer
                        show={props.show}
                        currentTrack={props.currentTrack}
                        track={props.track}
                        timeSections={props.timeSections}
                    />
                );
            }

            case "4stems": {
                return (
                    <FourStemTrackPlayer
                        show={props.show}
                        currentTrack={props.currentTrack}
                        track={props.track}
                        timeSections={props.timeSections}
                    />
                );
            }
        }
    })();

    return <Collapse in={props.show}>{innerPlayer}</Collapse>;
};

export default TrackPlayer;
