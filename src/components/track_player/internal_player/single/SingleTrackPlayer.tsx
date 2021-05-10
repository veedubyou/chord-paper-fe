import { Box } from "@material-ui/core";
import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import shortid from "shortid";
import { TimeSection } from "../../../../common/ChordModel/ChordLine";
import { SingleTrack } from "../../../../common/ChordModel/tracks/SingleTrack";
import ControlPane from "../ControlPane";
import { ensureGoogleDriveCacheBusted } from "../google_drive";
import { useTimeControls } from "../useTimeControls";

interface SingleTrackPlayerProps {
    show: boolean;
    currentTrack: boolean;

    track: SingleTrack;
    readonly timeSections: TimeSection[];
}

const SingleTrackPlayer: React.FC<SingleTrackPlayerProps> = (
    props: SingleTrackPlayerProps
): JSX.Element => {
    const playerRef = useRef<ReactPlayer>();
    const [playratePercentage, setPlayratePercentage] = useState(100);
    const timeControl = useTimeControls(
        props.show,
        playerRef.current,
        props.timeSections
    );
    const trackURL: string = useMemo(
        () => ensureGoogleDriveCacheBusted(props.track.url, shortid.generate()),
        [props.track.url]
    );

    const commonReactPlayerProps: ReactPlayerProps = {
        ref: playerRef,
        playing: timeControl.playing,
        controls: true,
        playbackRate: playratePercentage / 100,
        onPlay: timeControl.onPlay,
        onPause: timeControl.onPause,
        onProgress: timeControl.onProgress,
        progressInterval: 500,
        style: { minWidth: "50vw" },
        height: "auto",
        config: { file: { forceAudio: true } },
    };

    useEffect(() => {
        if (!props.currentTrack && timeControl.playing) {
            timeControl.onPause();
        }
    }, [props.currentTrack, timeControl]);

    return (
        <Box>
            <Box>
                <ReactPlayer {...commonReactPlayerProps} url={trackURL} />
            </Box>
            <ControlPane
                show={props.show}
                playing={timeControl.playing}
                sectionLabel={timeControl.currentSectionLabel}
                onPlay={timeControl.play}
                onPause={timeControl.pause}
                onJumpBack={timeControl.jumpBack}
                onJumpForward={timeControl.jumpForward}
                onSkipBack={timeControl.skipBack}
                onSkipForward={timeControl.skipForward}
                onGoToBeginning={timeControl.goToBeginning}
                playratePercentage={playratePercentage}
                onPlayratePercentageChange={setPlayratePercentage}
            />
        </Box>
    );
};

export default SingleTrackPlayer;
