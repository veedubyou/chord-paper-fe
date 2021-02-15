import { Box as UnstyledBox } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";
import React from "react";
import ReactPlayer from "react-player";

interface SongPlayerProps {
    url: string;
    height: string;
}

const SongPlayer: React.FC<SongPlayerProps> = (
    props: SongPlayerProps
): JSX.Element => {
    const FixedBottomBox = withStyles({
        root: {
            position: "fixed",
            left: 0,
            bottom: 0,
            backgroundColor: "white",
            width: "100%",
            height: props.height,
        },
    })(UnstyledBox);

    return (
        <FixedBottomBox>
            <ReactPlayer
                url={props.url}
                controls={true}
                width="100%"
                height={props.height}
            />
        </FixedBottomBox>
    );
};

export default SongPlayer;
