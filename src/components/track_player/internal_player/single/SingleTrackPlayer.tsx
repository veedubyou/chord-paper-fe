import { Box } from "@material-ui/core";
import React, { useEffect, useMemo } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import shortid from "shortid";
import { SingleTrack } from "../../../../common/ChordModel/tracks/SingleTrack";
import ControlPane from "../ControlPane";
import { ensureGoogleDriveCacheBusted } from "../google_drive";
import { makeReactPlayerProps } from "../reactPlayerProps";
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

    const reactPlayerProps: ReactPlayerProps = makeReactPlayerProps(
        props.playerControls
    );

    useEffect(() => {
        if (!props.currentTrack && props.playerControls.playing) {
            props.playerControls.onPause();
        }
    }, [props.currentTrack, props.playerControls]);

    return (
        <Box>
            <Box>
                <ReactPlayer {...reactPlayerProps} url={trackURL} />
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
                playrate={props.playerControls.playrate}
            />
        </Box>
    );
};

export default SingleTrackPlayer;
