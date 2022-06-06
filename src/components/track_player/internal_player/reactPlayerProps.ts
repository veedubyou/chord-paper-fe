import { PlayerControls } from "components/track_player/internal_player/usePlayerControls";
import { ReactEventHandler } from "react";
import { ReactPlayerProps } from "react-player";
import { BaseReactPlayerProps } from "react-player/base";
import { FilePlayerProps } from "react-player/file";

const makeBasePlayerProps = (
    playerControls: PlayerControls
): BaseReactPlayerProps => {
    return {
        ref: playerControls.playerRef,
        playing: playerControls.playing,
        controls: true,
        playbackRate: playerControls.tempo.percentage / 100,
        onPlay: playerControls.onPlay,
        onPause: playerControls.onPause,
        onProgress: playerControls.onProgress,
        progressInterval: 500,
        height: "auto",
        width: "unset",
        onKeyUp: (event: KeyboardEvent) => event.preventDefault(),
    };
};

const filePlayerStyle = { width: "100%", height: "revert" };

export const makeFilePlayerProps = (
    playerControls: PlayerControls,
    masterVolumePercentage: number,
    onVolumeChange?: ReactEventHandler<HTMLAudioElement>
): FilePlayerProps => {
    const attributes = {
        onVolumeChange: onVolumeChange,
        style: filePlayerStyle,
    };

    const basePlayerProps = makeBasePlayerProps(playerControls);

    return {
        ...basePlayerProps,
        volume: masterVolumePercentage / 100,
        config: {
            forceAudio: true,
            attributes: attributes,
        },
    };
};

export const makeReactPlayerProps = (
    playerControls: PlayerControls
): ReactPlayerProps => {
    const basePlayerProps = makeBasePlayerProps(playerControls);

    return {
        ...basePlayerProps,
        config: {
            file: {
                forceAudio: true,
                attributes: {
                    style: filePlayerStyle,
                },
            },
        },
    };
};
