import { Collapse } from "@material-ui/core";
import React, { useState } from "react";
import shortid from "shortid";
import { TimeSection } from "../../common/ChordModel/ChordLine";
import { FourStemKeys } from "../../common/ChordModel/tracks/StemTrack";
import { Track } from "../../common/ChordModel/tracks/Track";
import { PlainFn } from "../../common/PlainFn";
import StemTrackPlayer, {
    StemButton,
} from "./internal_player/4stems/StemTrackPlayer";
import SingleTrackPlayer from "./internal_player/single/SingleTrackPlayer";

export interface Refreshable {
    refresh: PlainFn;
}

interface TrackPlayerProps {
    show: boolean;
    currentTrack: boolean;
    refreshRef?: React.MutableRefObject<Refreshable | null>;

    track: Track;
    readonly timeSections: TimeSection[];
}

const TrackPlayer: React.FC<TrackPlayerProps> = (
    props: TrackPlayerProps
): JSX.Element => {
    const [refreshToken, setRefreshToken] = useState(shortid.generate());

    if (props.refreshRef !== undefined) {
        props.refreshRef.current = {
            refresh: () => {
                setRefreshToken(shortid.generate());
            },
        };
    }

    const innerPlayer: React.ReactElement = (() => {
        switch (props.track.track_type) {
            case "single": {
                return (
                    <SingleTrackPlayer
                        key={refreshToken}
                        show={props.show}
                        currentTrack={props.currentTrack}
                        track={props.track}
                        timeSections={props.timeSections}
                    />
                );
            }

            case "4stems": {
                const buttonSpecs: StemButton<FourStemKeys>[] = [
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
                        key={refreshToken}
                        show={props.show}
                        currentTrack={props.currentTrack}
                        track={props.track}
                        buttonSpecs={buttonSpecs}
                        timeSections={props.timeSections}
                    />
                );
            }
        }
    })();

    return <Collapse in={props.show}>{innerPlayer}</Collapse>;
};

export default TrackPlayer;
