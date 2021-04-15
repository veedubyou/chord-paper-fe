import { Collapse } from "@material-ui/core";
import React from "react";
import { TimeSection } from "../../common/ChordModel/ChordLine";
import { Track } from "../../common/ChordModel/Track";
import FourStemTrackPlayer from "./FourStemTrackPlayer";
import SingleTrackPlayer from "./SingleTrackPlayer";

interface TrackPlayerProps {
    show: boolean;
    track: Track;
    readonly timeSections: TimeSection[];

    playrate: number;
    onPlayrateChange: (newPlayrate: number) => void;
}

const TrackPlayer: React.FC<TrackPlayerProps> = (
    props: TrackPlayerProps
): JSX.Element => {
    const innerPlayer: React.ReactElement = (() => {
        switch (props.track.track_type) {
            case "single": {
                return (
                    <SingleTrackPlayer
                        track={props.track}
                        timeSections={props.timeSections}
                        playrate={props.playrate}
                        onPlayrateChange={props.onPlayrateChange}
                    />
                );
            }

            case "4stems": {
                return (
                    <FourStemTrackPlayer
                        track={props.track}
                        timeSections={props.timeSections}
                        playrate={props.playrate}
                        onPlayrateChange={props.onPlayrateChange}
                    />
                );
            }
        }
    })();

    return <Collapse in={props.show}>{innerPlayer}</Collapse>;
};

export default TrackPlayer;
