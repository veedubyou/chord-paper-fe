import { Typography } from "@material-ui/core";
import RadioIcon from "@material-ui/icons/Radio";
import { withStyles } from "@material-ui/styles";
import React from "react";
import { noopFn } from "../../common/PlainFn";
import { ControlButton } from "../track_player/internal_player/ControlButton";
import { ControlPaneBox } from "../track_player/internal_player/ControlPane";
import PlayrateControl from "../track_player/internal_player/PlayrateControl";
import StemTrackControlPane, {
    ControlPaneButtonColour,
    StemControl,
} from "../track_player/internal_player/stem/StemTrackControlPane";
import TransposeControl from "../track_player/internal_player/TransposeControl";
import { LineBreak } from "./Common";
import { convertToTutorialComponent } from "./TutorialComponent";

const title = "Track Player";

const SmallControlPaneBox = withStyles({
    root: {
        width: "min-content",
    },
})(ControlPaneBox);

const TrackPlayer: React.FC<{}> = (): JSX.Element => {
    const makeStemControl = <
        StemKey extends "vocals" | "other" | "bass" | "drums"
    >(
        label: StemKey,
        buttonColour: ControlPaneButtonColour
    ): StemControl<"vocals" | "other" | "bass" | "drums"> => {
        return {
            label: label,
            buttonColour: buttonColour,
            enabled: true,
            onEnabledChanged: noopFn,
            volume: 100,
            onVolumeChanged: noopFn,
        };
    };

    const stemControls = [
        makeStemControl("vocals", "lightBlue"),
        makeStemControl("other", "purple"),
        makeStemControl("bass", "pink"),
        makeStemControl("drums", "yellow"),
    ];

    return (
        <>
            <Typography variant="h5">{title}</Typography>
            <LineBreak />
            <Typography>
                The track player is an integrated audio player which helps with
                your transcription, or aids with your jam. The track player is
                available once a song is saved. Once the song is saved, click
                the <RadioIcon /> on the bottom right to bring up the player.
                This is available in both edit or play mode.
            </Typography>
            <LineBreak />
            <Typography variant="h6">Adding a track</Typography>
            <Typography>
                The track player requires at least one track to play. If you add
                a new track, several options of track types will be presented.
            </Typography>
            <LineBreak />
            <Typography>
                A single track is the most basic track type. The URL can be a
                Youtube URL, or a link to an mp3, or another media reference,
                etc.
            </Typography>
            <LineBreak />
            <Typography>
                2/4/5 stem tracks allow independent control of each stem (e.g.
                drums, vocals). The URLs are expected to point to an audio file.
                One way to create these stem files is to use Spleeter.
            </Typography>
            <LineBreak />
            <Typography>
                The "Split into 2/4/5 stem" tracks will take an audio track and
                turn them into stems. This is the easiest way to get stem
                tracks. For the URL, a Youtube URL or mp3 would work well.
            </Typography>
            <LineBreak />
            <Typography variant="h6">Transport</Typography>
            <Typography>
                In addition to the native player controls, there are also some
                transport buttons here the bottom:
            </Typography>
            <Typography>
                <ControlButton.Play />: Plays the song
            </Typography>
            <Typography>
                <ControlButton.Pause />: Pauses the song
            </Typography>
            <Typography>
                <ControlButton.JumpBack />: Jumps back 5 seconds
            </Typography>
            <Typography>
                <ControlButton.JumpForward />: Jumps forward 5 seconds
            </Typography>
            <Typography>
                <ControlButton.SkipBack />: Jumps back to the previous section
                (as marked by the section label times)
            </Typography>
            <Typography>
                <ControlButton.SkipForward />: Jumps forward to the next section
                (as marked by the section label times)
            </Typography>
            <Typography>
                <ControlButton.Beginning />: Jumps back to the beginning of the
                song
            </Typography>
            <LineBreak />
            <Typography variant="h6">Speed</Typography>
            <Typography>
                On the right, you will see a control like this:
            </Typography>
            <SmallControlPaneBox>
                <PlayrateControl playratePercentage={100} onChange={noopFn} />
            </SmallControlPaneBox>
            <Typography>
                Here, you can slow down the tempo of a track to listen more
                carefully. This will work with Youtube or mp3 tracks, and may or
                may not work with tracks from other sources.
            </Typography>
            <LineBreak />
            <Typography variant="h6">Transpose</Typography>
            <Typography>
                If you have a stem track, you will also see a control on the
                right like this:
            </Typography>
            <SmallControlPaneBox>
                <TransposeControl transposeLevel={0} onChange={noopFn} />
            </SmallControlPaneBox>
            <Typography>
                This allows you to transpose the song up or down a desired
                amount of semitones.
            </Typography>
            <LineBreak />
            <Typography variant="h6">Stems</Typography>
            <Typography>
                A stem is a part in the track, such as vocals, guitar, or drums.
                Once you end up with stem tracks, you will see controls like
                this:
            </Typography>
            <StemTrackControlPane stemControls={stemControls} />
            <LineBreak />
            <Typography>
                The exact stems will vary, but each stem can be muted by
                clicking on the respective button, or its volume adjusted via
                the slider.
            </Typography>
            <LineBreak />
            <Typography variant="h6">Keyboard shortcuts</Typography>
            <Typography>
                There are keyboard shortcuts for the transport controls, but
                they vary depending on the player is shown or minimized.
            </Typography>
            <LineBreak />
            <Typography>
                There are keyboard shortcuts for the transport controls, but
                they vary depending on the player is shown or minimized.
            </Typography>
            <LineBreak />
            <Typography>When the player is shown:</Typography>
            <Typography>/: minimize the player</Typography>
            <Typography>Space: play/pause</Typography>
            <Typography>Left arrow: jump back 5 seconds</Typography>
            <Typography>Right arrow: jump forward 5 seconds</Typography>
            <Typography>
                CMD/Control + left arrow: jump back one section
            </Typography>
            <Typography>
                CMD/Control + right arrow: jump forward one section
            </Typography>
            <LineBreak />
            <Typography>When the player is minimized:</Typography>
            <Typography>/: shows the player</Typography>
            <Typography>CMD/Control + Enter: play/pause</Typography>
            <Typography>
                CMD/Control + left arrow: jump back 5 seconds
            </Typography>
            <Typography>
                CMD/Control + right arrow: jump forward 5 seconds
            </Typography>
        </>
    );
};

export default convertToTutorialComponent(TrackPlayer, title);
