import { ReactEventHandler } from "react";
import { ReactPlayerProps } from "react-player";
import { BaseReactPlayerProps } from "react-player/base";
import { FilePlayerProps } from "react-player/file";
import { PlayerControls } from "./usePlayerControls";

const makeBasePlayerProps = (
    playerControls: PlayerControls
): BaseReactPlayerProps => {
    return {
        ref: playerControls.playerRef,
        playing: playerControls.playing,
        controls: true,
        playbackRate: playerControls.playrate.percentage / 100,
        onPlay: playerControls.onPlay,
        onPause: playerControls.onPause,
        onProgress: playerControls.onProgress,
        progressInterval: 500,
        height: "unset",
        width: "unset",
        onKeyUp: (event: KeyboardEvent) => event.preventDefault(),
    };
};

export const makeFilePlayerProps = (
    playerControls: PlayerControls,
    masterVolumePercentage: number,
    onVolumeChange?: ReactEventHandler<HTMLAudioElement>
): FilePlayerProps => {
    const attributes = (() => {
        if (onVolumeChange === undefined) {
            return undefined;
        }

        return {
            onVolumeChange: onVolumeChange,
        };
    })();

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
        config: { file: { forceAudio: true } },
    };
};
