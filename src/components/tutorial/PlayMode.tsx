import { Typography } from "@material-ui/core";
import PlayIcon from "@material-ui/icons/PlayArrow";
import React from "react";
import { LineBreak } from "./Common";

const PlayMode: React.FC<{}> = (): JSX.Element => {
    return (
        <>
            <Typography variant="h6">Play Mode</Typography>
            <LineBreak />
            <Typography>
                Play mode is where you focus on playing the song rather than
                writing or transcribing it. The chords and lyrics are laid out
                for ease of reading while playing through.
            </Typography>
            <LineBreak />
            <Typography>
                To go forward a page, left click anywhere on the page, or tap
                any button except the buttons that go back a page.
            </Typography>
            <LineBreak />
            <Typography>
                To go back a page, right click anywhere on the page, or tap
                left, up, or backspace.
            </Typography>
            <LineBreak />
            <Typography>
                Try this by going into your own song or the demo song, hovering
                over the menu icon on the bottom right, and clicking the{" "}
                <PlayIcon /> icon.
            </Typography>
        </>
    );
};

export default PlayMode;
