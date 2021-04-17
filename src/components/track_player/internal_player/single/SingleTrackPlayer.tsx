import { Box } from "@material-ui/core";
import React, { useRef } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import { TimeSection } from "../../../../common/ChordModel/ChordLine";
import { SingleTrack } from "../../../../common/ChordModel/Track";
import ControlPane from "../ControlPane";
import { useSections } from "../useSections";
import { ButtonActionAndState, useTimeControls } from "../useTimeControls";

interface SingleTrackPlayerProps {
    track: SingleTrack;
    readonly timeSections: TimeSection[];

    playrate: number;
    onPlayrateChange: (newPlayrate: number) => void;
}

const SingleTrackPlayer: React.FC<SingleTrackPlayerProps> = (
    props: SingleTrackPlayerProps
): JSX.Element => {
    const playerRef = useRef<ReactPlayer>();
    const timeControl = useTimeControls(playerRef.current);

    const [
        currentSectionLabel,
        currentSection,
        previousSection,
        nextSection,
    ] = useSections(props.timeSections, timeControl.currentTime);

    const commonReactPlayerProps: ReactPlayerProps = {
        ref: playerRef,
        playing: timeControl.playing,
        controls: true,
        playbackRate: props.playrate / 100,
        onPlay: timeControl.onPlay,
        onPause: timeControl.onPause,
        onProgress: timeControl.onProgress,
        progressInterval: 500,
        style: { minWidth: "50vw" },
        height: "auto",
        config: { file: { forceAudio: true } },
    };

    const playButton: ButtonActionAndState = {
        action: timeControl.play,
        enabled: true,
    };

    const skipBack = timeControl.makeSkipBack(currentSection, previousSection);
    const skipForward = timeControl.makeSkipForward(nextSection);

    return (
        <Box>
            <Box>
                <ReactPlayer
                    {...commonReactPlayerProps}
                    url={props.track.url}
                />
            </Box>
            <ControlPane
                playing={timeControl.playing}
                sectionLabel={currentSectionLabel}
                onPlay={playButton}
                onPause={timeControl.pause}
                onJumpBack={timeControl.jumpBack}
                onJumpForward={timeControl.jumpForward}
                onSkipBack={skipBack}
                onSkipForward={skipForward}
                onGoToBeginning={timeControl.goToBeginning}
                playrate={props.playrate}
                onPlayrateChange={props.onPlayrateChange}
            />
        </Box>
    );
};

export default SingleTrackPlayer;
