import { Typography } from "@material-ui/core";
import React from "react";
import { LineBreak } from "./Common";

const Header = () => {
    return <Typography variant="h5">Learning Chord Paper</Typography>;
};

const Preamble = () => {
    return (
        <>
            <Typography>
                Chord Paper aims to be as intuitive and handy as possible, but
                there could still be features that you don't know about
                immediately. Let's walk through the basics together by making
                some changes to chords and lyrics!
            </Typography>
            <LineBreak />
            <Typography>
                Since Chord Paper is still in early stages, some of these could
                change in the future.
            </Typography>
        </>
    );
};

const Starting: React.FC<{}> = (): JSX.Element => {
    return (
        <>
            <Header />
            <LineBreak />
            <Preamble />
        </>
    );
};

export default Starting;
