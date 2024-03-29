import { Box } from "@mui/material";
import { SingleTrack } from "common/ChordModel/tracks/SingleTrack";
import ControlPane from "components/track_player/internal_player/ControlPane";
import { ensureGoogleDriveCacheBusted } from "components/track_player/internal_player/google_drive";
import { makeReactPlayerProps } from "components/track_player/internal_player/reactPlayerProps";
import { PlayerControls } from "components/track_player/internal_player/usePlayerControls";
import React, { useEffect, useMemo } from "react";
import ReactPlayer, { ReactPlayerProps } from "react-player";
import shortid from "shortid";

interface SingleTrackPlayerProps {
    focused: boolean;
    isCurrentTrack: boolean;
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
        if (!props.isCurrentTrack && props.playerControls.playing) {
            props.playerControls.onPause();
        }
    }, [props.isCurrentTrack, props.playerControls]);

    return (
        <Box>
            <Box>
                <ReactPlayer {...reactPlayerProps} url={trackURL} />
            </Box>
            <ControlPane
                show={props.focused}
                playing={props.playerControls.playing}
                transport={props.playerControls.transport}
                tempo={props.playerControls.tempo}
                abLoop={props.playerControls.abLoop}
            />
        </Box>
    );
};

export default SingleTrackPlayer;
