import { Box } from "@material-ui/core";
import React, { useEffect, useMemo } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import shortid from "shortid";
import { SingleTrack } from "../../../../common/ChordModel/tracks/SingleTrack";
import ControlPane from "../ControlPane";
import { ensureGoogleDriveCacheBusted } from "../google_drive";
import { PlayerControls } from "../usePlayerControls";

interface SingleTrackPlayerProps {
    focused: boolean;
    currentTrack: boolean;
    playerControls: PlayerControls;
    track: SingleTrack;
}

const SingleTrackPlayer: React.FC<SingleTrackPlayerProps> = (
    props: SingleTrackPlayerProps
): JSX.Element => {
    const trackURL: string = useMemo(
        () => ensureGoogleDriveCacheBusted(props.track.url, shortid.generate()),
        [props.track.url]
    );

    const commonReactPlayerProps: ReactPlayerProps = {
        ref: props.playerControls.playerRef,
        playing: props.playerControls.playing,
        controls: true,
        playbackRate: props.playerControls.playratePercentage / 100,
        onPlay: props.playerControls.onPlay,
        onPause: props.playerControls.onPause,
        onProgress: props.playerControls.onProgress,
        progressInterval: 500,
        style: { minWidth: "50vw" },
        height: "auto",
        config: { file: { forceAudio: true } },
    };

    useEffect(() => {
        if (!props.currentTrack && props.playerControls.playing) {
            props.playerControls.onPause();
        }
    }, [props.currentTrack, props.playerControls]);

    return (
        <Box>
            <Box>
                <ReactPlayer {...commonReactPlayerProps} url={trackURL} />
            </Box>
            <ControlPane
                show={props.focused}
                playing={props.playerControls.playing}
                sectionLabel={props.playerControls.currentSectionLabel}
                onTogglePlay={props.playerControls.togglePlay}
                onJumpBack={props.playerControls.jumpBack}
                onJumpForward={props.playerControls.jumpForward}
                onSkipBack={props.playerControls.skipBack}
                onSkipForward={props.playerControls.skipForward}
                onGoToBeginning={props.playerControls.goToBeginning}
                playratePercentage={props.playerControls.playratePercentage}
                onPlayratePercentageChange={
                    props.playerControls.onPlayratePercentageChange
                }
            />
        </Box>
    );
};

export default SingleTrackPlayer;
