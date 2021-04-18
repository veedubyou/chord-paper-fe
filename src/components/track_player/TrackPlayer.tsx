import { Collapse } from "@material-ui/core";
import React from "react";
import { TimeSection } from "../../common/ChordModel/ChordLine";
import { Track } from "../../common/ChordModel/Track";
import { PlainFn } from "../../common/PlainFn";
import FourStemTrackPlayer from "./internal_player/4stems/FourStemTrackPlayer";
import SingleTrackPlayer from "./internal_player/single/SingleTrackPlayer";

interface TrackPlayerProps {
    show: boolean;
    currentTrack: boolean;

    track: Track;
    readonly timeSections: TimeSection[];

    playrate: number;
    onPlayrateChange: (newPlayrate: number) => void;

    onMinimize: PlainFn;
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
                        playrate={props.playrate}
                        onPlayrateChange={props.onPlayrateChange}
                        onMinimize={props.onMinimize}
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
                        playrate={props.playrate}
                        onPlayrateChange={props.onPlayrateChange}
                        onMinimize={props.onMinimize}
                    />
                );
            }
        }
    })();

    return <Collapse in={props.show}>{innerPlayer}</Collapse>;
};

export default TrackPlayer;
